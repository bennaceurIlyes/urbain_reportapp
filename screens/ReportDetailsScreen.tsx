import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Text,
  Icon,
  ChevronLeftIcon,
  Badge,
  BadgeText,
  Center,
  Divider
} from '@gluestack-ui/themed';
import { BlurView } from 'expo-blur';
import { MapPin, Calendar, AlertCircle, Clock, CheckCircle2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export const ReportDetailsScreen = ({ route, navigation }: any) => {
  const { report } = route.params;
  const imageUrl = report.attachments?.length > 0 ? report.attachments[0].file_url : null;
  console.log('ReportDetails Image URL:', imageUrl);

  const getPriorityInfo = (priority: number) => {
    switch(priority) {
      case 1: return { label: 'Low Priority', color: '#34C759' };
      case 2: return { label: 'Medium Priority', color: '#FF9500' };
      case 3: return { label: 'High Priority', color: '#FF3B30' };
      default: return { label: 'Unknown', color: '#8E8E93' };
    }
  };

  const getStatusInfo = (status: number) => {
    switch(status) {
      case 0: return { label: 'Pending Review', color: '#8E8E93', icon: Clock };
      case 1: return { label: 'In Progress', color: '#006233', icon: Clock };
      case 2: return { label: 'Resolved', color: '#34C759', icon: CheckCircle2 };
      default: return { label: 'Unknown', color: '#8E8E93', icon: Clock };
    }
  };

  const priority = getPriorityInfo(report.priority);
  const status = getStatusInfo(report.status);
  const StatusIcon = status.icon;

  return (
    <Box flex={1} bg="$backgroundLight50">
      {/* Header Overlay */}
      <Box position="absolute" top={0} left={0} right={0} zIndex={20}>
        <BlurView intensity={90} tint="light" style={styles.headerBlur}>
          <HStack alignItems="center" px="$4" pt={Platform.OS === 'ios' ? 70 : 40} pb="$3">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <BlurView intensity={60} style={styles.backBlur}>
                <Icon as={ChevronLeftIcon} size="xl" color="#006233" />
              </BlurView>
            </TouchableOpacity>
            <Heading size="md" ml="$2" numberOfLines={1} color="#006233">{report.title}</Heading>
          </HStack>
        </BlurView>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Box height={height * 0.45} width={width}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.heroImage} 
              onError={(e) => console.log('Error loading hero image:', e.nativeEvent.error)}
            />
          ) : (
            <Center bg="$backgroundLight200" height="100%">
              <AlertCircle size={48} color="#CCC" />
              <Text color="$textLight500" mt="$2">No image available</Text>
            </Center>
          )}
          <Box position="absolute" bottom={0} left={0} right={0} height={100}>
            {/* Gradient shadow would go here */}
          </Box>
        </Box>

        <VStack space="xl" p="$6" mt="-$8" bg="$white" borderTopLeftRadius="$3xl" borderTopRightRadius="$3xl">
          <HStack justifyContent="space-between" alignItems="center">
            <Badge variant="solid" action={report.status === 2 ? "success" : "warning"} borderRadius="$full" px="$3" py="$1">
              <HStack space="xs" alignItems="center">
                <StatusIcon size={14} color="#FFF" />
                <BadgeText textTransform="uppercase" fontWeight="$bold">{status.label}</BadgeText>
              </HStack>
            </Badge>
            <HStack space="xs" alignItems="center">
              <Calendar size={14} color="#8E8E93" />
              <Text size="sm" color="$textLight500">
                {new Date(report.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </HStack>
          </HStack>

          <VStack space="xs">
            <Heading size="xl" color="#333">{report.title}</Heading>
            <HStack alignItems="center" space="xs">
              <MapPin size={16} color="#006233" />
              <Text color="#006233" fontWeight="$medium">Reported Location</Text>
            </HStack>
          </VStack>

          <Box bg="$backgroundLight50" p="$4" borderRadius="$2xl">
            <Text size="md" lineHeight="$xl" color="$textLight800">
              {report.description}
            </Text>
          </Box>

          <HStack space="md">
            <VStack flex={1} bg="$backgroundLight50" p="$4" borderRadius="$2xl" alignItems="center">
              <AlertCircle size={20} color={priority.color} />
              <Text size="xs" color="$textLight500" mt="$1">Priority</Text>
              <Text fontWeight="$bold" color={priority.color}>{priority.label}</Text>
            </VStack>
            <VStack flex={1} bg="$backgroundLight50" p="$4" borderRadius="$2xl" alignItems="center">
              <MapPin size={20} color="#006233" />
              <Text size="xs" color="$textLight500" mt="$1">Location</Text>
              <Text fontWeight="$bold" color="$textLight800" numberOfLines={1}>Tagged</Text>
            </VStack>
          </HStack>

          <Divider my="$4" />

          <VStack space="md">
            <Heading size="md">Timeline</Heading>
            <VStack space="lg">
              <HStack space="md">
                <Box alignItems="center">
                  <Box w={12} h={12} borderRadius="$full" bg="#006233" />
                  <Box w={2} flex={1} bg="$backgroundLight200" />
                </Box>
                <VStack pb="$4">
                  <Text fontWeight="$bold">Report Submitted</Text>
                  <Text size="sm" color="$textLight500">{new Date(report.created_at).toLocaleTimeString()}</Text>
                </VStack>
              </HStack>
              <HStack space="md">
                <Box alignItems="center">
                  <Box w={12} h={12} borderRadius="$full" bg={report.status >= 1 ? "#006233" : "$backgroundLight200"} />
                  <Box w={2} flex={1} bg="$backgroundLight200" />
                </Box>
                <VStack pb="$4">
                  <Text fontWeight="$bold" color={report.status >= 1 ? "$textLight900" : "$textLight400"}>Under Review</Text>
                  <Text size="sm" color="$textLight500">Awaiting official validation</Text>
                </VStack>
              </HStack>
              <HStack space="md">
                <Box alignItems="center">
                  <Box w={12} h={12} borderRadius="$full" bg={report.status >= 2 ? "$success500" : "$backgroundLight200"} />
                </Box>
                <VStack>
                  <Text fontWeight="$bold" color={report.status >= 2 ? "$textLight900" : "$textLight400"}>Resolved</Text>
                  <Text size="sm" color="$textLight500">Issue has been fixed</Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>

          <Box h="$10" />
        </VStack>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { padding: 4 },
  backBlur: { padding: 8, borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.7)' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
});
