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

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t, lang, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState<ReportWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
            {renderStatsRow()}
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <FlatList
            data={reports}
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
            ListHeaderComponent={renderStatsRow}
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
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
