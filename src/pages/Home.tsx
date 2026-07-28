import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Scholarship, Blog } from '../types';
import { HeroSection } from '../components/HeroSection';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { BlogCard } from '../components/BlogCard';
import { AdBanner } from '../components/AdBanner';
import { SEO } from '../components/SEO';
import { GraduationCap, ArrowRight, Sparkles, Globe, Award, BookOpen, CheckCircle2, Shield } from 'lucide-react';

export const Home: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [schRes, blogRes] = await Promise.all([
          axios.get('/api/scholarships'),
          axios.get('/api/blogs'),
        ]);
        setScholarships(schRes.data);
        setBlogs(blogRes.data);
      } catch (err) {
        console.error('Error loading home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredScholarships = scholarships.filter((s) => {
    if (activeTab === 'All') return true;
    return s.degreeLevel === activeTab;
  });

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Scholarship Portal',
    url: 'https://scholarship-portal.vercel.app',
    description: 'Verified global scholarships and CSC grants directory for BS, MS, and PhD students worldwide.',
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 pb-20">
      <SEO
        title="Global Scholarship Portal — CSC & Fully Funded Grants 2026"
        description="Search thousands of fully funded international scholarships, Chinese Government CSC grants, and university funding for BS, MS, and PhD applicants."
        keywords="scholarships 2026, CSC scholarship, fully funded study abroad, China CSC grant, degree scholarships"
        schema={websiteSchema}
      />
      {/* Header Ad Slot */}
      <AdBanner placement="header" />

      {/* Hero Section */}
      <HeroSection />

      {/* Quick Category / Country Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <span>Top Destinations:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['China (CSC)', 'USA', 'Finland', 'UK', 'Canada', 'Germany', 'Australia'].map((c) => {
              const countryName = c.split(' ')[0];
              return (
                <Link
                  key={c}
                  to={`/scholarships?country=${countryName}`}
                  className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-[#D4AF37] hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/80 transition-all duration-200"
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Scholarships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-1">
              <Award className="w-4 h-4" />
              <span>Curated Funding Opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white">
              Featured Global <span className="italic font-normal text-[#D4AF37]">Scholarships</span>
            </h2>
          </div>

          {/* Degree Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {['All', 'BS', 'MS', 'PhD'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'All' ? 'All Opportunities' : `${tab} Grants`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-900/40 rounded-3xl animate-pulse border border-slate-800/80" />
            ))}
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 p-12 text-center rounded-3xl">
            <p className="text-slate-400 text-sm">No scholarships found matching this degree level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.slice(0, 6).map((scholarship) => (
              <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/scholarships"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[#D4AF37] hover:text-[#e0bc46] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md"
          >
            <span>Explore All Scholarships Directory ({scholarships.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* In-Feed Sponsored Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <AdBanner placement="in-feed" />
      </div>

      {/* Latest Blog & Guides Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Expert Application Strategies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white">
              Scholarship <span className="italic font-normal text-[#D4AF37]">Guides & Articles</span>
            </h2>
          </div>

          <Link
            to="/blog"
            className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#e0bc46] flex items-center gap-1.5"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-slate-900/40 rounded-3xl animate-pulse border border-slate-800/80" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 p-8 text-center rounded-3xl">
            <p className="text-slate-400 text-sm">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
