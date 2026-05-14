import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Dimensions, TouchableOpacity, Image } from 'react-native';
import { 
  Text, 
  useTheme, 
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { getUserReports, ReportWithAttachments } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const theme = useTheme();
  const [reports, setReports] = useState<ReportWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    if (!user) {
      console.log('No user found in HomeScreen, skipping fetch');
      return;
    }
    
    console.log('HomeScreen: Fetching reports...');
    try {
      const data = await getUserReports();
      console.log('HomeScreen: Reports fetched successfully, count:', data.length);
      setReports(data);
    } catch (error) {
      console.error('HomeScreen: Fetch error:', error);
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

  const getPriorityColor = (priority: number) => {
    switch(priority) {
      case 1: return '#10B981'; // Green
      case 2: return '#F59E0B'; // Amber
      case 3: return '#EF4444'; // Red
      default: return '#94A3B8';
    }
  };

  const getStatusInfo = (status: number) => {
    switch(status) {
      case 0: return { label: 'Pending', color: '#64748B' };
      case 1: return { label: 'In Progress', color: '#3B82F6' };
      case 2: return { label: 'Resolved', color: '#10B981' };
      default: return { label: 'Unknown', color: '#94A3B8' };
    }
  };

  const renderItem = ({ item }: { item: ReportWithAttachments }) => {
    const imageUrl = item.attachments?.length > 0 ? item.attachments[0].file_url : null;

    const status = getStatusInfo(item.status);
    const priorityColor = getPriorityColor(item.priority);
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ReportDetails', { report: item })}
      >
        <View style={styles.cardInner}>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />
          )}
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <View style={[styles.statusDot, { backgroundColor: status.color }]} />
              <Text variant="labelMedium" style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text variant="labelMedium" style={styles.dateText}>
                {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Text>
            </View>
            
            <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            
            <Text variant="bodyMedium" style={styles.cardDesc} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.locationContainer}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color="#64748B" />
                <Text variant="bodySmall" style={styles.footerText}>Location Tagged</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '15' }]}>
                <Text variant="labelSmall" style={{ color: priorityColor, fontWeight: '700' }}>
                  {item.priority === 3 ? 'High' : item.priority === 2 ? 'Medium' : 'Low'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topHeader}>
        <View style={styles.userSection}>
          <Text variant="labelLarge" style={styles.greeting}>Good morning</Text>
          <Text variant="displaySmall" style={styles.headerTitle}>My Reports</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <MaterialCommunityIcons name="account-circle-outline" size={28} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="#1B4FD8" />
          </View>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#1B4FD8"
              />
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={64} color="#E2E8F0" />
                <Text variant="headlineSmall" style={styles.emptyTitle}>No reports yet</Text>
                <Text variant="bodyMedium" style={styles.emptySubtext}>
                  Tap the button below to report your first urban issue.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Report')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20
  },
  userSection: { flex: 1 },
  greeting: { color: '#64748B', fontWeight: '500', marginBottom: 4 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  profileButton: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  content: { flex: 1 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 120 },
  card: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden'
  },
  cardInner: { flexDirection: 'column' },
  cardImage: { width: '100%', height: 180, backgroundColor: '#F8FAFC' },
  cardBody: { padding: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontWeight: '700', letterSpacing: 0.2 },
  dotSeparator: { marginHorizontal: 8, color: '#CBD5E1' },
  dateText: { color: '#64748B', fontWeight: '500' },
  cardTitle: { fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  cardDesc: { color: '#64748B', lineHeight: 20, marginBottom: 16 },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC'
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  footerText: { color: '#64748B', marginLeft: 6, fontWeight: '500' },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontWeight: '700', marginTop: 24, color: '#0F172A' },
  emptySubtext: { textAlign: 'center', marginTop: 8, color: '#64748B', lineHeight: 22 },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1B4FD8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 100
  },
});

