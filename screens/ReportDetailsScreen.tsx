import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { 
  Text, 
  useTheme, 
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export const ReportDetailsScreen = ({ route, navigation }: any) => {
  const { report } = route.params;
  const theme = useTheme();

  // Handle location if it's a JSON string from the database
  const location = typeof report.location === 'string' 
    ? JSON.parse(report.location) 
    : report.location;

  const imageUrl = report.attachments?.length > 0 ? report.attachments[0].file_url : null;



  const getPriorityColor = (priority: number) => {
    switch(priority) {
      case 1: return '#10B981';
      case 2: return '#F59E0B';
      case 3: return '#EF4444';
      default: return '#94A3B8';
    }
  };

  const getStatusInfo = (status: number) => {
    switch(status) {
      case 0: return { label: 'Pending Review', color: '#64748B', icon: 'clock-outline' };
      case 1: return { label: 'In Progress', color: '#1B4FD8', icon: 'progress-wrench' };
      case 2: return { label: 'Resolved', color: '#10B981', icon: 'check-circle' };
      default: return { label: 'Unknown', color: '#94A3B8', icon: 'help-circle' };
    }
  };

  const status = getStatusInfo(report.status);
  const priorityColor = getPriorityColor(report.priority);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.heroImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialCommunityIcons name="image-off-outline" size={64} color="#CBD5E1" />
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.1)']}
            style={styles.gradient}
          />
          
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color="#0F172A" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content Section */}
        <View style={styles.contentCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
              <MaterialCommunityIcons name={status.icon as any} size={16} color={status.color} />
              <Text variant="labelLarge" style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
            <View style={[styles.priorityBadge, { borderColor: priorityColor }]}>
              <Text variant="labelSmall" style={{ color: priorityColor, fontWeight: '800' }}>
                {report.priority === 3 ? 'HIGH PRIORITY' : report.priority === 2 ? 'MEDIUM' : 'LOW'}
              </Text>
            </View>
          </View>

          <Text variant="displaySmall" style={styles.title}>{report.title}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar-outline" size={16} color="#64748B" />
              <Text variant="bodySmall" style={styles.metaText}>
                {new Date(report.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748B" />
              <Text variant="bodySmall" style={styles.metaText}>Location Verified</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
          <Text variant="bodyLarge" style={styles.description}>
            {report.description}
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text variant="labelSmall" style={styles.infoLabel}>REPORT ID</Text>
              <Text variant="titleSmall" style={styles.infoValue}>#{report.id.substring(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text variant="labelSmall" style={styles.infoLabel}>LOCATION</Text>
              <Text variant="titleSmall" style={styles.infoValue}>
                {location?.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'N/A'}
              </Text>
            </View>
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>Progress Timeline</Text>
          <View style={styles.timeline}>
            <TimelineItem 
              title="Report Created" 
              subtitle="Received by urban services" 
              time={new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              completed 
              isLast={false} 
            />
            <TimelineItem 
              title="Under Investigation" 
              subtitle="Technical team assigned" 
              completed={report.status >= 1} 
              isLast={false} 
            />
            <TimelineItem 
              title="Work in Progress" 
              subtitle="Maintenance team on-site" 
              completed={report.status >= 1.5} 
              isLast={false} 
            />
            <TimelineItem 
              title="Resolved" 
              subtitle="Issue successfully fixed" 
              completed={report.status >= 2} 
              isLast 
            />
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const TimelineItem = ({ title, subtitle, time, completed, isLast }: any) => {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLine}>
        <View style={[styles.timelineDot, { backgroundColor: completed ? '#1B4FD8' : '#E2E8F0' }]}>
          {completed && <MaterialCommunityIcons name="check" size={8} color="white" />}
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: completed ? '#1B4FD8' : '#E2E8F0' }]} />}
      </View>
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeader}>
          <Text variant="titleSmall" style={[styles.timelineTitle, { opacity: completed ? 1 : 0.4 }]}>{title}</Text>
          {time && <Text variant="labelSmall" style={styles.timelineTime}>{time}</Text>}
        </View>
        <Text variant="bodySmall" style={[styles.timelineSub, { opacity: completed ? 0.7 : 0.3 }]}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  heroContainer: { height: height * 0.45, width: '100%' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },
  gradient: { ...StyleSheet.absoluteFillObject },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20 },
  backButton: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4
  },
  contentCard: { 
    flex: 1, marginTop: -40, 
    borderTopLeftRadius: 40, borderTopRightRadius: 40, 
    backgroundColor: '#FFFFFF', padding: 28,
    minHeight: height * 0.6
  },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  statusBadge: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 
  },
  statusText: { marginLeft: 6, fontWeight: '700' },
  priorityBadge: { 
    paddingHorizontal: 10, paddingVertical: 4, 
    borderRadius: 6, borderWidth: 1 
  },
  title: { fontWeight: '800', color: '#0F172A', marginBottom: 16, letterSpacing: -1 },
  metaRow: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: '#64748B', marginLeft: 6, fontWeight: '500' },
  divider: { backgroundColor: '#F1F5F9', marginBottom: 24 },
  sectionTitle: { fontWeight: '700', color: '#0F172A', marginBottom: 12, letterSpacing: 0.2 },
  description: { color: '#475569', lineHeight: 26, marginBottom: 32 },
  infoGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  infoCard: { 
    flex: 1, padding: 16, borderRadius: 20, 
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' 
  },
  infoLabel: { color: '#94A3B8', fontWeight: '700', marginBottom: 4 },
  infoValue: { color: '#0F172A', fontWeight: '600' },
  timeline: { marginTop: 8 },
  timelineItem: { flexDirection: 'row', minHeight: 70 },
  timelineLine: { alignItems: 'center', width: 20 },
  timelineDot: { 
    width: 20, height: 20, borderRadius: 10, 
    justifyContent: 'center', alignItems: 'center', zIndex: 1 
  },
  line: { width: 2, flex: 1, marginVertical: -2 },
  timelineContent: { flex: 1, marginLeft: 16, paddingBottom: 20 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineTitle: { fontWeight: '700', color: '#0F172A' },
  timelineTime: { color: '#94A3B8', fontWeight: '500' },
  timelineSub: { color: '#64748B', marginTop: 2 },
});
