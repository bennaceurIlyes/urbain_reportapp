import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { getTeamLeaderReports, ReportWithAttachments } from '../services/api';
import { ReportCard } from '../components/ReportCard';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonCard';
import { colors, spacing, radius, toArabicNumeral } from '../theme';
import { useLanguage } from '../hooks/useLanguage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FilterTab = 'all' | 'pending' | 'in_progress' | 'completed';

export const TeamLeaderHomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t, lang, isRTL, setLanguage } = useLanguage();
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

  const completedCount = reports.filter(r => 
    r.is_resolved === true || r.status === 3 || r.status === 4 || r.status === 'completed' || r.status === 'approved'
  ).length;

  const inProgressCount = reports.filter(r => {
    const isCompleted = r.is_resolved === true || r.status === 3 || r.status === 4 || r.status === 'completed' || r.status === 'approved';
    return !isCompleted && !!r.work_in_progress_at;
  }).length;

  const pendingCount = reports.length - completedCount - inProgressCount;

  const formatNum = (n: number) => toArabicNumeral(n, lang);
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('teamLeader');

  const filters: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'pending', label: t('filterPending') },
    { key: 'in_progress', label: t('filterInProgress') },
    { key: 'completed', label: t('filterCompleted') },
  ];

  const renderFilterTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.filterRow, isRTL && styles.filterRowRTL]}
    >
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
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Header Card with Gradient & Geometric Decorations */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={[styles.headerGradient, { paddingTop: insets.top + spacing.sm }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Geometric circular decorations */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        {/* Top Row: Logo & Language Toggle */}
        <View style={[styles.headerTopRow, isRTL && styles.headerTopRowRTL]}>
          <View style={[styles.frostedPill, isRTL ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }]}>
            <Text style={[styles.frostedPillText, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
              💧 {lang === 'ar' ? 'مهامي' : 'Mahammi'}
            </Text>
            {pendingCount > 0 && (
              <View style={styles.notifBadge} />
            )}
          </View>

          <View style={[styles.langContainer, isRTL ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'ar' && styles.langBtnActive]}
              onPress={() => lang !== 'ar' && setLanguage('ar')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langBtnText, lang === 'ar' && styles.langBtnTextActive]}>عربي</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'fr' && styles.langBtnActive]}
              onPress={() => lang !== 'fr' && setLanguage('fr')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langBtnText, lang === 'fr' && styles.langBtnTextActive]}>FR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Block */}
        <View style={[styles.welcomeBlock, isRTL && styles.welcomeBlockRTL]}>
          <View style={[styles.roleRow, isRTL && styles.roleRowRTL]}>
            <View style={styles.glowDot} />
            <Text style={[styles.roleText, { fontFamily: isRTL ? 'IBMPlexArabic-Medium' : 'IBMPlexSans-Medium' }]}>
              {lang === 'ar' ? 'رئيس الفرقة — مركز عمليات الصيانة' : 'Chef de brigade — Centre de maintenance'}
            </Text>
          </View>
          <Text style={[styles.welcomeName, { fontFamily: isRTL ? 'IBMPlexArabic-Bold' : 'IBMPlexSans-Bold' }]}>
            {lang === 'ar' ? `مرحباً، ${displayName} 👋` : `Bonjour, ${displayName} 👋`}
          </Text>
          <Text style={[styles.subtitleText, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
            {lang === 'ar' 
              ? `ولاية بشار · ${formatNum(filteredReports.length)} مهام نشطة اليوم` 
              : `Wilaya de Béchar · ${filteredReports.length} tâches actives aujourd'hui`}
          </Text>
        </View>

        {/* Translucent Stats Row (3 chips) */}
        <View style={[styles.statsRow, isRTL && styles.statsRowRTL]}>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{formatNum(reports.length)}</Text>
            <Text style={[styles.statLbl, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
              {lang === 'ar' ? 'المجموع' : 'Total'}
            </Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{formatNum(inProgressCount)}</Text>
            <Text style={[styles.statLbl, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
              {lang === 'ar' ? 'قيد التنفيذ' : 'En cours'}
            </Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{formatNum(completedCount)}</Text>
            <Text style={[styles.statLbl, { fontFamily: isRTL ? 'IBMPlexArabic-Regular' : 'IBMPlexSans-Regular' }]}>
              {lang === 'ar' ? 'المكتملة' : 'Terminées'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Pill-Shape Tab Filters */}
      <View style={styles.filterSection}>
        {renderFilterTabs()}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {loading ? (
          <View style={styles.skeletonContainer}>
            {renderHeader()}
            <View style={{ paddingHorizontal: spacing.md }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          </View>
        ) : (
          <FlatList
            data={filteredReports}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardPadding}>
                <ReportCard
                  report={item}
                  onPress={() => navigation.navigate('TeamLeaderReportDetails', { report: item })}
                  showAssignedTime
                  isTeamLeader={true}
                />
              </View>
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
            ListEmptyComponent={
              <View style={styles.cardPadding}>
                <EmptyState type="no-tasks" />
              </View>
            }
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
  container: { 
    flex: 1, 
    backgroundColor: colors.pageBg 
  },
  content: { 
    flex: 1 
  },
  skeletonContainer: { 
    paddingTop: 0 
  },
  listContainer: { 
    paddingHorizontal: 0 
  },
  cardPadding: {
    paddingHorizontal: spacing.md,
  },
  
  headerContainer: {
    backgroundColor: colors.pageBg,
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(13, 107, 154, 0.15)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  headerTopRowRTL: {
    flexDirection: 'row-reverse',
  },
  frostedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
  },
  frostedPillText: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  notifBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  
  // Custom lang switcher
  langContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: radius.xs + 2,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  langBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  langBtnText: {
    fontSize: 11,
    fontFamily: 'IBMPlexSans-Bold',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  langBtnTextActive: {
    color: colors.primary,
  },

  welcomeBlock: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    zIndex: 1,
  },
  welcomeBlockRTL: {
    alignItems: 'flex-end',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  roleRowRTL: {
    flexDirection: 'row-reverse',
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C0EAF5',
  },
  roleText: {
    fontSize: 11,
    color: '#E2F4F8',
    letterSpacing: 0.3,
  },
  welcomeName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'left',
  },
  subtitleText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'left',
  },
  
  // Translucent Metric Chips
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  statsRowRTL: {
    flexDirection: 'row-reverse',
  },
  statChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statVal: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '800',
    lineHeight: 24,
  },
  statLbl: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  
  // Scrollable pill selectors
  filterSection: {
    paddingVertical: spacing.md,
    backgroundColor: colors.pageBg,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  filterRowRTL: {
    flexDirection: 'row-reverse',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C0EAF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
});
