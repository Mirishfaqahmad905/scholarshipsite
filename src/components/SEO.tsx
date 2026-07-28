import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Global Scholarship Portal — Verified Scholarships & CSC Grants 2026',
  description = 'Find fully funded scholarships, Chinese Government CSC grants, and university funding for BS, MS, and PhD programs with application guides.',
  keywords = 'scholarships, CSC scholarship, fully funded scholarship, study in China, masters scholarship, PhD grant',
  image = '/uploads/default-scholarship.jpg',
  url,
  type = 'website',
  schema,
}) => {
  useEffect(() => {
    // Page Title
    document.title = title.includes('Scholarship') ? title : `${title} | Scholarship Portal`;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute('content', type);

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);

    // Schema.org JSON-LD Injection
    if (schema) {
      const existingScript = document.getElementById('json-ld-schema');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById('json-ld-schema');
      if (script) script.remove();
    };
  }, [title, description, keywords, image, url, type, schema]);

  return null;
};
