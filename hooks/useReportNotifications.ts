import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../services/supabaseConfig';
import { useAuth } from './useAuth';
import { useLanguage } from './useLanguage';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useReportNotifications = () => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Request permissions
    const requestPermissions = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.log('Permission not granted for notifications');
          return;
        }

        // Configure Android channel for sounds and heads-up display
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#006233',
            sound: 'notifcation.mp3',
          });
        }
      } catch (error) {
        console.warn('Expo Go Notification limitation caught:', error);
      }
    };

    requestPermissions();

    // Listeners for interacting with notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time changes on the reports table for this user
    const subscription = supabase
      .channel('reports_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reports',
          filter: `reporter_id=eq.${user.id}`, // Only listen to this citizen's reports
        },
        (payload) => {
          const oldStatus = payload.old?.status;
          const newStatus = payload.new?.status;

          // If the status has changed, trigger a local notification!
          if (newStatus && oldStatus !== newStatus) {
            const reportTitle = payload.new?.title || 'Report';
            
            // Map status to localized string (basic mapping)
            const getStatusText = (status: string | number) => {
              const statusMap: Record<string, { ar: string; fr: string }> = {
                'pending': { ar: 'قيد الانتظار', fr: 'En attente' },
                'assigned': { ar: 'مُكلف', fr: 'Assigné' },
                'in_progress': { ar: 'قيد التنفيذ', fr: 'En cours' },
                'completed': { ar: 'مكتمل', fr: 'Terminé' },
                'approved': { ar: 'معتمد', fr: 'Approuvé' },
              };
              const s = String(status);
              return statusMap[s] ? statusMap[s][lang] : s;
            };

            const title = lang === 'ar' ? 'تحديث حالة البلاغ!' : 'Mise à jour du signalement!';
            const body = lang === 'ar' 
              ? `تم تغيير حالة بلاغك "${reportTitle}" إلى ${getStatusText(newStatus)}.`
              : `Le statut de votre signalement "${reportTitle}" a été changé en ${getStatusText(newStatus)}.`;

            Notifications.scheduleNotificationAsync({
              content: {
                title,
                body,
                sound: 'notifcation.mp3',
                priority: Notifications.AndroidNotificationPriority.MAX,
              },
              trigger: null, // trigger immediately
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, lang]);
};
