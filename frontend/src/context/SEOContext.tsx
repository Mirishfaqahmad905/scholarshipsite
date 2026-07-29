import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { SEOConfig } from '../types';

interface MetaOverride {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonicalUrl?: string;
  type?: string;
}

interface SEOContextType {
  seo: SEOConfig | null;
  loading: boolean;
  refreshSEO: () => Promise<void>;
  updateSEOConfig: (data: Partial<SEOConfig>) => Promise<void>;
  setPageSEO: (override?: MetaOverride) => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seo, setSeo] = useState<SEOConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSEO = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seo');
      setSeo(data);
    } catch (err) {
      console.error('Failed to fetch SEO settings from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEO();
  }, []);

  const setPageSEO = useCallback(
    (override?: MetaOverride) => {
      if (!seo) return;

      const pageTitle = override?.title
        ? `${override.title} | ${seo.metaTitle || 'Global Scholarship Portal'}`
        : seo.metaTitle || 'Global Scholarship Portal';

      const pageDesc = override?.description || seo.metaDescription || '';
      const pageKeywords = override?.keywords || seo.metaKeywords || '';
      const pageImage = override?.image || seo.ogImage || '/uploads/default-scholarship.jpg';
      const canonical = override?.canonicalUrl || seo.canonicalUrl || window.location.href;

      // Document Title
      document.title = pageTitle;

      // Meta Helper
      const setMetaTag = (selector: string, attributeName: string, attributeVal: string, content: string) => {
        let el = document.querySelector(selector);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attributeName, attributeVal);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      // Standard Meta Tags
      setMetaTag('meta[name="description"]', 'name', 'description', pageDesc);
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', pageKeywords);
      setMetaTag('meta[name="author"]', 'name', 'author', seo.author || 'Global Scholarship Portal');

      // Open Graph
      setMetaTag('meta[property="og:title"]', 'property', 'og:title', override?.title || seo.ogTitle || pageTitle);
      setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDesc);
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', pageImage);
      setMetaTag('meta[property="og:type"]', 'property', 'og:type', override?.type || 'website');
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonical);

      // Twitter Cards
      setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', seo.twitterCard || 'summary_large_image');
      if (seo.twitterSite) setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', seo.twitterSite);
      setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', override?.title || seo.ogTitle || pageTitle);
      setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDesc);
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', pageImage);

      // Verification Meta Tags
      if (seo.googleSiteVerification) {
        setMetaTag('meta[name="google-site-verification"]', 'name', 'google-site-verification', seo.googleSiteVerification);
      }
      if (seo.bingSiteVerification) {
        setMetaTag('meta[name="msvalidate.01"]', 'name', 'msvalidate.01', seo.bingSiteVerification);
      }

      // Canonical Link
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', canonical);

      // JSON-LD Structured Data
      if (seo.structuredDataJson) {
        let scriptEl = document.getElementById('seo-structured-data');
        if (!scriptEl) {
          scriptEl = document.createElement('script');
          scriptEl.setAttribute('id', 'seo-structured-data');
          scriptEl.setAttribute('type', 'application/ld+json');
          document.head.appendChild(scriptEl);
        }
        scriptEl.textContent = seo.structuredDataJson;
      }
    },
    [seo]
  );

  useEffect(() => {
    if (seo) {
      setPageSEO();
    }
  }, [seo, setPageSEO]);

  const updateSEOConfig = async (updatedFields: Partial<SEOConfig>) => {
    try {
      const { data } = await axios.put('/api/seo', updatedFields);
      setSeo(data.seo);
    } catch (err) {
      console.error('Failed to update SEO config:', err);
      throw err;
    }
  };

  return (
    <SEOContext.Provider value={{ seo, loading, refreshSEO: fetchSEO, updateSEOConfig, setPageSEO }}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within an SEOProvider');
  }
  return context;
};
