import React, { useEffect } from 'react';
import { useSocial } from '../context/SocialContext';

export const GoogleAdScriptLoader: React.FC = () => {
  const { settings } = useSocial();

  useEffect(() => {
    if (!settings) return;

    // 1. Google AdSense Automatic Ads Script Injection
    const pubId = settings.googleAdSensePublisherId?.trim();
    const isAutoAdsOn = settings.googleAutoAdsEnabled !== false;

    if (pubId) {
      const client = pubId.startsWith('ca-pub-') ? pubId : `ca-pub-${pubId}`;
      const existingScript = document.getElementById('google-adsense-script');

      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-adsense-script';
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
        script.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(script);
      }

      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      if (isAutoAdsOn) {
        try {
          ((window as any).adsbygoogle).push({
            google_ad_client: client,
            enable_page_level_ads: true,
          });
        } catch (e) {
          // ignore if already pushed
        }
      }
    }

    // 2. Custom Header Script / HTML Tag Injection
    const headerScript = settings.headerAdScript?.trim();
    if (headerScript) {
      const existingContainer = document.getElementById('custom-header-ad-script-container');
      if (existingContainer) {
        existingContainer.remove();
      }

      const container = document.createElement('div');
      container.id = 'custom-header-ad-script-container';
      container.style.display = 'none';

      const parser = new DOMParser();
      const doc = parser.parseFromString(headerScript, 'text/html');
      const scripts = doc.querySelectorAll('script');

      doc.body.childNodes.forEach((node) => {
        if (node.nodeName !== 'SCRIPT') {
          container.appendChild(node.cloneNode(true));
        }
      });
      document.head.appendChild(container);

      scripts.forEach((s) => {
        const newScript = document.createElement('script');
        Array.from(s.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
        newScript.text = s.text;
        document.head.appendChild(newScript);
      });
    }
  }, [settings?.googleAdSensePublisherId, settings?.googleAutoAdsEnabled, settings?.headerAdScript]);

  return null;
};
