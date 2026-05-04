import React from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input as GInput,
  InputField,
  Center,
} from '@gluestack-ui/themed';
import { supabase } from '../services/supabaseConfig';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../components/Button';

const { width, height } = Dimensions.get('window');

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password too short!').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

export const RegisterScreen = ({ navigation }: any) => {
  const handleRegister = async (values: any, { setSubmitting }: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      Alert.alert('Success', 'Account created! You can now log in.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box flex={1} bg="$backgroundLight50">
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1000' }}
        style={styles.bgImage}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Center mb="$8">
              <Heading size="2xl" color="$textLight900">Create Account</Heading>
              <Text style={styles.subtitle}>Help us build a better city today</Text>
            </Center>

            <Box 
              bg="$white" 
              p="$6" 
              borderRadius="$3xl"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 5
              }}
            >
              <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={RegisterSchema}
                onSubmit={handleRegister}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                  <VStack space="xl">
                    <FormControl isInvalid={!!(touched.email && errors.email)}>
                      <FormControlLabel mb="$1">
                        <FormControlLabelText>Email</FormControlLabelText>
                      </FormControlLabel>
                      <GInput variant="rounded" size="lg">
                        <InputField 
                          placeholder="your@email.com" 
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </GInput>
                    </FormControl>

                    <FormControl isInvalid={!!(touched.password && errors.password)}>
                      <FormControlLabel mb="$1">
                        <FormControlLabelText>Password</FormControlLabelText>
                      </FormControlLabel>
                      <GInput variant="rounded" size="lg">
                        <InputField 
                          placeholder="At least 6 characters" 
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={values.password}
                          secureTextEntry
                        />
                      </GInput>
                    </FormControl>

                    <FormControl isInvalid={!!(touched.confirmPassword && errors.confirmPassword)}>
                      <FormControlLabel mb="$1">
                        <FormControlLabelText>Confirm Password</FormControlLabelText>
                      </FormControlLabel>
                      <GInput variant="rounded" size="lg">
                        <InputField 
                          placeholder="Repeat your password" 
                          onChangeText={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          value={values.confirmPassword}
                          secureTextEntry
                        />
                      </GInput>
                    </FormControl>

                    <Button 
                      title="Create Account" 
                      onPress={() => handleSubmit()} 
                      loading={isSubmitting}
                      style={styles.registerBtn}
                    />

                    <HStack justifyContent="center" alignItems="center" space="xs" mt="$2">
                      <Text style={styles.footerText}>Already have an account?</Text>
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.linkText}>Sign In</Text>
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                )}
              </Formik>
            </Box>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  bgImage: { width, height },
  container: { flex: 1, backgroundColor: 'rgba(248, 249, 251, 0.7)' },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4, textAlign: 'center' },
  registerBtn: { height: 56, borderRadius: 28, marginTop: 10 },
  footerText: { fontSize: 14, color: '#666' },
  linkText: { fontSize: 14, color: '#006233', fontWeight: 'bold' },
});
