import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
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

type FilterTab = 'all' | 'pending' | 'in_progress';

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
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return r.status === 'assigned' || r.status === 'pending' || r.status === 0;
    if (activeFilter === 'in_progress') return r.status === 'in_progress' || r.status === 1;
    return true;
  });

  const pendingCount = reports.filter(r =>
    r.status === 'assigned' || r.status === 'pending' || r.status === 0
  ).length;

  const formatNum = (n: number) => toArabicNumeral(n, lang);

  const filters: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'pending', label: t('filterPending') },
    { key: 'in_progress', label: t('filterInProgress') },
  ];

  const renderFilterTabs = () => (
    <View style={[styles.filterRow, isRTL && styles.filterRowRTL]}>
      {filters.map(f => (
        <TouchableOpacity
          key={f.key}
          style={[styles.filterTab, activeFilter === f.key && styles.filterTabActive]}
          onPress={() => setActiveFilter(f.key)}
          accessibilityLabel={f.label}
          accessibilityRole="button"
        >
          <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
            {f.label}
          </Text>
          {activeFilter === f.key && <View style={styles.filterIndicator} />}
        </TouchableOpacity>
      ))}
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

      {renderFilterTabs()}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.skeletonContainer}>
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
                tintColor={colors.republicGreen}
                colors={[colors.republicGreen]}
              />
            }
            contentContainerStyle={[styles.listContainer, { paddingBottom: 100 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState type="no-tasks" />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  content: { flex: 1 },
  skeletonContainer: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  listContainer: { paddingHorizontal: spacing.md },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardWhite,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterRowRTL: {
    flexDirection: 'row-reverse',
  },
  filterTab: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    position: 'relative',
    alignItems: 'center',
  },
  filterTabActive: {},
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  filterTextActive: {
    color: colors.republicGreen,
    fontWeight: '700',
  },
  filterIndicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing.md,
    right: spacing.md,
    height: 3,
    backgroundColor: colors.republicGreen,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
