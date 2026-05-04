import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, Dimensions, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Icon,
  SearchIcon,
  Fab,
  FabIcon,
  AddIcon,
  Pressable
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseConfig';
import { getUserReports, ReportWithAttachments } from '../services/api';
import { SkeletonCard } from '../components/SkeletonCard';
import { Button } from '../components/Button';
import { MapPin, Calendar, AlertCircle, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const fetchReports = async () => {
    if (!user) return;
    try {
      const data = await getUserReports();
      setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchReports();
    });
    return unsubscribe;
  }, [navigation, user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };



  const getPriorityInfo = (priority: number) => {
    switch(priority) {
      case 1: return { label: 'Low', color: '#34C759' };
      case 2: return { label: 'Medium', color: '#FF9500' };
      case 3: return { label: 'High', color: '#FF3B30' };
      default: return { label: 'Unknown', color: '#8E8E93' };
    }
  };

  const getStatusInfo = (status: number) => {
    switch(status) {
      case 0: return { label: 'PENDING', color: '#8E8E93' };
      case 1: return { label: 'IN PROGRESS', color: '#007AFF' };
      case 2: return { label: 'RESOLVED', color: '#34C759' };
      default: return { label: 'UNKNOWN', color: '#8E8E93' };
    }
  };

  const renderSkeleton = () => (
    <VStack space="md" p="$4">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </VStack>
  );

  const renderItem = ({ item }: { item: ReportWithAttachments }) => {
    const imageUrl = item.attachments?.length > 0 ? item.attachments[0].file_url : null;
    const priority = getPriorityInfo(item.priority);
    const status = getStatusInfo(item.status);
    console.log(`Report ${item.id} image URL:`, imageUrl);
    
    return (
      <Pressable onPress={() => navigation.navigate('ReportDetails', { report: item })}>
        <Box 
          bg="$white" 
          p="$4" 
          borderRadius="$2xl" 
          mb="$4" 
          borderWidth={1}
          borderColor="rgba(0,0,0,0.05)"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 3
          }}
        >
          <VStack space="sm">
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack flex={1}>
                <Heading size="md" color="$textLight900" numberOfLines={1}>
                  {item.title}
                </Heading>
                <HStack alignItems="center" space="xs" mt="$1">
                  <MapPin size={12} color="#8E8E93" />
                  <Text style={styles.footerText}>Location Tagged</Text>
                </HStack>
              </VStack>
              <Box px="$3" py="$1" borderRadius="$full" bg={status.color + '15'}>
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </Box>
            </HStack>

            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            
            {imageUrl && (
              <Box mt="$2" borderRadius="$xl" overflow="hidden" height={180}>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.image} 
                  onError={(e) => console.log(`Error loading image for report ${item.id}:`, e.nativeEvent.error)}
                />
              </Box>
            )}
            
            <HStack justifyContent="space-between" alignItems="center" mt="$2">
              <HStack space="xs" alignItems="center">
                <Calendar size={14} color="#8E8E93" />
                <Text style={styles.footerText}>{new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              </HStack>
              <HStack space="xs" alignItems="center">
                <Box w={8} h={8} borderRadius="$full" bg={priority.color} />
                <Text style={[styles.priorityText, { color: priority.color }]}>{priority.label}</Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Glass Effect Header */}
      <Box style={styles.headerWrapper}>
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <HStack justifyContent="space-between" alignItems="center" px="$6" pt={Platform.OS === 'ios' ? 70 : 40} pb="$4">
            <VStack space="xs">
              <Heading size="xl" color="#006233">
                Urban Report
              </Heading>
              <Text style={styles.greetingText}>Algerian Citizen Portal</Text>
            </VStack>

          </HStack>
        </BlurView>
      </Box>

      <View style={styles.content}>


        <HStack justifyContent="space-between" alignItems="center" mb="$4" px="$1" mt="$4">
          <VStack>
            <Heading size="lg" color="$textLight900">My Submissions</Heading>
            <Text style={{ fontSize: 12, color: '#8E8E93' }}>Only showing issues you reported</Text>
          </VStack>
        </HStack>
        
        {loading ? (
          renderSkeleton()
        ) : (
          <FlatList
            data={reports}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#007AFF" 
                colors={['#007AFF']}
              />
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <VStack alignItems="center" justifyContent="center" mt="$20" space="lg">
                <Box bg="$primary50" p="$6" borderRadius="$full">
                  <AlertCircle size={48} color="#007AFF" strokeWidth={1.5} />
                </Box>
                <VStack space="xs" alignItems="center">
                  <Heading size="md" textAlign="center">No issues reported</Heading>
                  <Text style={styles.emptySubtext}>Your neighborhood looks clean! Or you can be the first to report something.</Text>
                </VStack>
                <Button 
                  title="Report New Issue" 
                  onPress={() => navigation.navigate('Report')}
                  variant="outline"
                  style={{ marginTop: 10 }}
                />
              </VStack>
            }
          />
        )}
      </View>

      <Fab
        size="lg"
        placement="bottom right"
        onPress={() => navigation.navigate('Report')}
        bg="#006233"
        style={styles.fab}
        m="$8"
      >
        <FabIcon as={AddIcon} />
      </Fab>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  blurContainer: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  greetingText: { fontSize: 13, color: '#006233', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  userName: { letterSpacing: -0.5 },
  content: { flex: 1, paddingTop: Platform.OS === 'ios' ? 140 : 110, paddingHorizontal: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingLeft: 4 },
  filterContainer: { paddingVertical: 5, paddingRight: 30 },
  seeAll: { color: '#007AFF', fontWeight: '700', fontSize: 14 },
  listContainer: { paddingBottom: 120 },
  categoryText: { fontSize: 12, color: '#8E8E93', fontWeight: '600' },
  statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  cardDesc: { fontSize: 15, color: '#666', lineHeight: 22, marginTop: 10 },
  image: { width: '100%', height: 200, resizeMode: 'cover' },
  footerText: { fontSize: 12, color: '#8E8E93', fontWeight: '500' },
  priorityText: { fontSize: 12, fontWeight: '700' },
  emptySubtext: { fontSize: 15, color: '#8E8E93', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#006233',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  }
});

