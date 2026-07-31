import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { SiteSettings } from '../types';

interface SocialContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
}

const defaultSettings: SiteSettings = {
  siteName: 'Global Scholarship Portal',
  siteLink: 'https://scholarship-portal.vercel.app',
  siteLogoUrl: '',
  contactEmail: 'techhub905@gmail.com',
  whatsapp: '+1234567890',
  whatsappMessage: 'Hello! I need scholarship application help.',
  github: 'https://github.com/techhub905',
  snapchat: 'https://snapchat.com',
  instagram: 'https://instagram.com',
  telegram: 'https://t.me',
  facebook: 'https://facebook.com',
  twitter: 'https://x.com',
  linkedin: 'https://linkedin.com',
  youtube: 'https://youtube.com',
  googleAdSensePublisherId: '',
  googleAutoAdsEnabled: true,
  headerAdScript: '',
  customLinks: [],
};

const SocialContext = createContext<SocialContextType>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
  updateSettings: async () => false,
});

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/settings');
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load social settings from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const token = localStorage.getItem('sp_token') || '';
      const userRaw = localStorage.getItem('userInfo');
      const fallbackToken = userRaw ? JSON.parse(userRaw).token : '';
      const authToken = token || fallbackToken;

      const { data } = await axios.put('/api/settings', newSettings, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (data && data.settings) {
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update social settings:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SocialContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => useContext(SocialContext);
