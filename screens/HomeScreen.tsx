import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { getUserReports, ReportWithAttachments } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GovHeader } from '../components/GovHeader';
import { ReportCard } from '../components/ReportCard';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { colors, spacing, radius, shadows, toArabicNumeral } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';

type FilterTab = 'all' | 'pending' | 'in_progress' | 'completed';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t, lang, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState<ReportWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const fabScale = useRef(new Animated.Value(1)).current;

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

  // Stats calculation
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 0 || r.status === 'pending').length;
  const resolvedReports = reports.filter(r => r.status === 2 || r.status === 'completed' || r.status === 'approved').length;

  const formatNum = (n: number) => toArabicNumeral(n, lang);

  const onFabPressIn = () => {
    Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true, speed: 50 }).start();
  };
  const onFabPressOut = () => {
    Animated.spring(fabScale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
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

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('citizen');

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

  const renderStatsRow = () => (
    <View style={[styles.statsRow, isRTL && styles.statsRowRTL]}>
      {/* Total Reports Stat Tile */}
      <View style={[styles.statCard, { borderColor: '#BFDBFE', backgroundColor: colors.primaryTint }]}>
        <View style={[styles.statIconBg, { backgroundColor: 'rgba(37, 99, 235, 0.08)' }]}>
          <MaterialCommunityIcons name="file-document-multiple-outline" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.statNumber, { color: colors.primary, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{formatNum(totalReports)}</Text>
        <Text style={[styles.statLabel, isRTL && styles.statLabelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Medium' : 'IBMPlexSans-Medium' }]}>{t('totalReports')}</Text>
      </View>
      
      {/* Pending Reports Stat Tile */}
      <View style={[styles.statCard, { borderColor: '#FDE68A', backgroundColor: '#FFFDF5' }]}>
        <View style={[styles.statIconBg, { backgroundColor: 'rgba(229, 156, 42, 0.08)' }]}>
          <MaterialCommunityIcons name="clock-alert-outline" size={18} color={colors.priority.medium} />
        </View>
        <Text style={[styles.statNumber, { color: colors.priority.medium, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{formatNum(pendingReports)}</Text>
        <Text style={[styles.statLabel, isRTL && styles.statLabelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Medium' : 'IBMPlexSans-Medium' }]}>{t('pendingCount')}</Text>
      </View>

      {/* Resolved Reports Stat Tile */}
      <View style={[styles.statCard, { borderColor: '#A7F3D0', backgroundColor: '#F6FDF9' }]}>
        <View style={[styles.statIconBg, { backgroundColor: 'rgba(40, 167, 96, 0.08)' }]}>
          <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.priority.low} />
        </View>
        <Text style={[styles.statNumber, { color: colors.priority.low, fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>{formatNum(resolvedReports)}</Text>
        <Text style={[styles.statLabel, isRTL && styles.statLabelRTL, { fontFamily: isRTL ? 'IBMPlexArabic-Medium' : 'IBMPlexSans-Medium' }]}>{t('resolvedCount')}</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={[styles.greetingRow, isRTL && styles.greetingRowRTL]}>
        <View>
          <Text style={[styles.greetingText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
            {lang === 'ar' ? `مرحباً، ${displayName} 👋` : `Bonjour, ${displayName} 👋`}
          </Text>
          <Text style={[styles.greetingSubtitle, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
            {lang === 'ar' ? 'بوابة المواطن الرقمية لبلدية بشار' : 'Portail citoyen de la commune de Béchar'}
          </Text>
        </View>
      </View>
      {renderStatsRow()}
      {renderFilterTabs()}
    </View>
  );

  return (
    <View style={styles.container}>
      <GovHeader
        title={t('myReports')}
        subtitle={t('ministry')}
        badge={totalReports > 0 ? formatNum(totalReports) : undefined}
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
                onPress={() => navigation.navigate('ReportDetails', { report: item })}
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
            contentContainerStyle={[styles.listContainer, { paddingBottom: 120 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={<EmptyState type="no-reports" />}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          />
        )}
      </View>

      {/* FAB (Circular, Primary Color) */}
      <Animated.View style={[styles.fabContainer, isRTL ? styles.fabLeft : styles.fabRight, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Report')}
          onPressIn={onFabPressIn}
          onPressOut={onFabPressOut}
          activeOpacity={1}
          accessibilityLabel={t('newReport')}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.pageBg },
  content: { flex: 1 },
  skeletonContainer: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  listContainer: { paddingHorizontal: spacing.md },
  
  headerSection: {
    paddingVertical: spacing.md,
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

  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  statsRowRTL: {
    flexDirection: 'row-reverse',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md, // 16px modern rounding
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: 22,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statLabelRTL: {
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    zIndex: 100,
  },
  fabRight: {
    right: spacing.lg,
  },
  fabLeft: {
    left: spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28, // Perfect circle border radius
    backgroundColor: colors.primary, // Vibrant accent blue
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.elevated,
  },
});
