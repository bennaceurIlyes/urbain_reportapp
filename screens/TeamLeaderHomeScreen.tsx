import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { getTeamLeaderReports, ReportWithAttachments } from '../services/api';
import { GovHeader } from '../components/GovHeader';
import { ReportCard } from '../components/ReportCard';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { colors, spacing, toArabicNumeral } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FilterTab = 'all' | 'pending' | 'in_progress' | 'completed';

export const TeamLeaderHomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t, lang, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState<ReportWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const fetchReports = async () => {
    if (!user) return;
    try {
      const data = await getTeamLeaderReports();
      setReports(data);
    } catch (error) {
      console.error('Fetch error:', error);
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

  const filteredReports = reports.filter(r => {
    const isCompleted = r.is_resolved === true || r.status === 3 || r.status === 4 || r.status === 'completed' || r.status === 'approved';
    const isPending = !isCompleted && !r.work_in_progress_at;
    const isInProgress = !isCompleted && !!r.work_in_progress_at;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return isPending;
    if (activeFilter === 'in_progress') return isInProgress;
    if (activeFilter === 'completed') return isCompleted;
    return true;
  });

  const pendingCount = reports.filter(r => {
    const isCompleted = r.is_resolved === true || r.status === 3 || r.status === 4 || r.status === 'completed' || r.status === 'approved';
    return !isCompleted && !r.work_in_progress_at;
  }).length;

  const formatNum = (n: number) => toArabicNumeral(n, lang);
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('teamLeader');

  const filters: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'pending', label: t('filterPending') },
    { key: 'in_progress', label: t('filterInProgress') },
    { key: 'completed', label: t('filterCompleted') },
  ];

  const renderFilterTabs = () => (
    <View style={[styles.filterRow, isRTL && styles.filterRowRTL]}>
      {filters.map(f => {
        const isActive = activeFilter === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, isActive && styles.filterTabActive]}
            onPress={() => setActiveFilter(f.key)}
            accessibilityLabel={f.label}
            accessibilityRole="button"
            activeOpacity={0.8}
          >
            <Text 
              style={[
                styles.filterText, 
                isActive && styles.filterTextActive,
                { fontFamily: isRTL ? (isActive ? 'IBMPlexArabic-Bold' : 'IBMPlexArabic-Regular') : (isActive ? 'IBMPlexSans-Bold' : 'IBMPlexSans-Regular') }
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={[styles.greetingRow, isRTL && styles.greetingRowRTL]}>
        <View>
          <Text style={[styles.greetingText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
            {lang === 'ar' ? `مرحباً، رئيس الفرقة ${displayName} 🛠️` : `Bonjour, Chef ${displayName} 🛠️`}
          </Text>
          <Text style={[styles.greetingSubtitle, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
            {lang === 'ar' ? 'مركز عمليات الصيانة لولاية بشار' : 'Centre d\'opérations de maintenance de Béchar'}
          </Text>
        </View>
      </View>
      {renderFilterTabs()}
    </View>
  );

  return (
    <View style={styles.container}>
      <GovHeader
        title={t('myTasks')}
        subtitle={t('teamLeaderMode')}
        badge={pendingCount > 0 ? formatNum(pendingCount) : undefined}
        rightElement={<LanguageToggle />}
      />

      <View style={styles.content}>
        {loading ? (
          <View style={styles.skeletonContainer}>
            {renderHeader()}
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <FlatList
            data={filteredReports}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ReportCard
                report={item}
                onPress={() => navigation.navigate('TeamLeaderReportDetails', { report: item })}
                showAssignedTime
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            contentContainerStyle={[styles.listContainer, { paddingBottom: 100 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={<EmptyState type="no-tasks" />}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pageBg },
  content: { flex: 1 },
  skeletonContainer: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  listContainer: { paddingHorizontal: spacing.md },
  
  headerSection: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingHorizontal: 2,
  },
  greetingRowRTL: {
    flexDirection: 'row-reverse',
  },
  greetingText: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'left',
  },
  greetingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'left',
  },
  
  // Custom Filter Pills/Chips
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginVertical: spacing.sm,
    paddingHorizontal: 2,
  },
  filterRowRTL: {
    flexDirection: 'row-reverse',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, // Modern floating circular pills
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0', // clean minimalist outline
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  filterTabActive: {
    backgroundColor: colors.primary, // Vibrant accent blue
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
});
