import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, t as translate } from '../i18n/strings';

const LANGUAGE_KEY = '@app_language';

interface LanguageContextType {
  lang: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  isRTL: true,
  setLanguage: async () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (stored === 'ar' || stored === 'fr') {
        setLang(stored);
        const isRTL = stored === 'ar';
        if (I18nManager.isRTL !== isRTL) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
        }
      } else {
        // Default to Arabic
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      }
    } catch (error) {
      console.warn('Failed to load language preference:', error);
    } finally {
      setIsReady(true);
    }
  };

  const setLanguage = useCallback(async (newLang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLang);
      setLang(newLang);
      const isRTL = newLang === 'ar';
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        // Note: In production, you'd call RNRestart.restart() here
        // For now the layout will update on next render cycle
      }
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  const isRTL = lang === 'ar';

  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ lang, isRTL, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
