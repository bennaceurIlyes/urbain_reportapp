import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Avatar, 
  AvatarFallbackText, 
  AvatarImage,
  Text,
  Icon,
  ChevronLeftIcon,
  Center,
  Divider,
  Pressable
} from '@gluestack-ui/themed';
import { BlurView } from 'expo-blur';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseConfig';
import { User, LogOut, Settings, Bell, Shield, HelpCircle, ChevronRight, PieChart, Clock, CheckCircle } from 'lucide-react-native';

export const ProfileScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) Alert.alert("Error", error.message);
          }
        }
      ]
    );
  };

  const MenuItem = ({ icon: IconComp, label, color = "#444" }: any) => (
    <Pressable w="100%" onPress={() => {}}>
      <HStack justifyContent="space-between" alignItems="center" py="$4">
        <HStack space="md" alignItems="center">
          <Box p="$2" borderRadius="$xl" bg="$backgroundLight100">
            <IconComp size={18} color={color} />
          </Box>
          <Text fontWeight="$medium" color="$textLight800" size="sm">{label}</Text>
        </HStack>
        <ChevronRight size={18} color="#CCC" />
      </HStack>
    </Pressable>
  );

  return (
    <Box flex={1} bg="$backgroundLight50">
      {/* Glass Header */}
      <Box zIndex={10}>
        <BlurView intensity={90} tint="light" style={styles.headerBlur}>
          <HStack alignItems="center" px="$6" pt={Platform.OS === 'ios' ? 50 : 20} pb="$3">
            <Heading size="xl">Profile</Heading>
          </HStack>
        </BlurView>
      </Box>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Center mt="$6" mb="$8">
          <Box p="$1" borderRadius="$full" borderWidth={2} borderColor="$primary500" style={styles.avatarBorder}>
            <Avatar size="2xl" borderRadius="$full">
              <AvatarFallbackText>{user?.email}</AvatarFallbackText>
              <AvatarImage 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' }} 
                alt="User profile avatar"
              />
            </Avatar>
          </Box>
          <Heading size="xl" mt="$4">{user?.email?.split('@')[0]}</Heading>
          <Text color="$textLight500" size="sm">{user?.email}</Text>
          
          <HStack 
            mt="$6" 
            space="xl" 
            bg="$white" 
            p="$5" 
            borderRadius="$2xl" 
            w="85%"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2
            }}
          >
            <VStack alignItems="center" flex={1}>
              <Box bg="$primary50" p="$2" borderRadius="$full" mb="$1">
                <PieChart size={16} color="#007AFF" />
              </Box>
              <Heading size="sm">12</Heading>
              <Text size="xs" color="$textLight400">Total</Text>
            </VStack>
            <Divider orientation="vertical" />
            <VStack alignItems="center" flex={1}>
              <Box bg="$warning50" p="$2" borderRadius="$full" mb="$1">
                <Clock size={16} color="#FF9500" />
              </Box>
              <Heading size="sm">4</Heading>
              <Text size="xs" color="$textLight400">Pending</Text>
            </VStack>
            <Divider orientation="vertical" />
            <VStack alignItems="center" flex={1}>
              <Box bg="$success50" p="$2" borderRadius="$full" mb="$1">
                <CheckCircle size={16} color="#34C759" />
              </Box>
              <Heading size="sm">8</Heading>
              <Text size="xs" color="$textLight400">Fixed</Text>
            </VStack>
          </HStack>
        </Center>

        <Box px="$6" mb="$4">
          <Text fontWeight="$bold" color="$textLight900" size="md">Settings</Text>
        </Box>
        
        <Box 
          bg="$white" 
          px="$6" 
          borderRadius="$3xl" 
          mx="$4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 3
          }}
        >
          <VStack>
            <MenuItem icon={User} label="Personal Information" color="#007AFF" />
            <Divider />
            <MenuItem icon={Bell} label="Notifications" color="#FF9500" />
            <Divider />
            <MenuItem icon={Shield} label="Privacy & Security" color="#34C759" />
            <Divider />
            <MenuItem icon={HelpCircle} label="Help & Support" color="#5856D6" />
          </VStack>
        </Box>

        <Box 
          bg="$white" 
          px="$6" 
          borderRadius="$3xl" 
          mx="$4" 
          mt="$6" 
          mb="$10"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 3
          }}
        >
          <Pressable onPress={handleLogout}>
            <HStack justifyContent="space-between" alignItems="center" py="$4">
              <HStack space="md" alignItems="center">
                <Box p="$2" borderRadius="$xl" bg="$error50">
                  <LogOut size={18} color="#FF3B30" />
                </Box>
                <Text fontWeight="$semibold" color="$error600" size="sm">Log Out</Text>
              </HStack>
            </HStack>
          </Pressable>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  scroll: { paddingBottom: 100 },
  avatarBorder: {
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  }
});
