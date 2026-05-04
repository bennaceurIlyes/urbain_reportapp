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

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const LoginScreen = ({ navigation }: any) => {
  const handleLogin = async (values: any, { setSubmitting }: any) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
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
              <BlurView intensity={20} style={styles.logoBlur}>
                <Box bg="#006233" p="$4" borderRadius="$2xl">
                  <Heading size="3xl" color="$white">U</Heading>
                </Box>
              </BlurView>
              <Heading size="2xl" color="$textLight900" mt="$4">Urban Report</Heading>
              <Text style={styles.subtitle}>Cleaner cities, one report at a time</Text>
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
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
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
                          placeholder="Your password" 
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={values.password}
                          secureTextEntry
                        />
                      </GInput>
                    </FormControl>

                    <Button 
                      title="Sign In" 
                      onPress={() => handleSubmit()} 
                      loading={isSubmitting}
                      style={styles.loginBtn}
                    />

                    <HStack justifyContent="center" alignItems="center" space="xs" mt="$2">
                      <Text style={styles.footerText}>New here?</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>Create Account</Text>
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
  logoBlur: { padding: 4, borderRadius: 24, overflow: 'hidden' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4, textAlign: 'center' },
  loginBtn: { height: 56, borderRadius: 28, marginTop: 10 },
  footerText: { fontSize: 14, color: '#666' },
  linkText: { fontSize: 14, color: '#006233', fontWeight: 'bold' },
});
