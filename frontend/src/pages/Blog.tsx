import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Blog } from '../types';
import { BlogCard } from '../components/BlogCard';
import { AdBanner } from '../components/AdBanner';
import { BookOpen, Search, Sparkles } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/blogs');
        setBlogs(data);
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Scholarship Portal Journal</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white">
              Articles & <span className="italic font-normal text-[#D4AF37]">Application Guides</span>
            </h1>
            <p className="text-sm text-slate-400 mt-2 font-sans">
              In-depth strategies, document templates, and visa guidance for international scholarship applicants.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search guides, essay tips..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner placement="header" />

        {/* Blog Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-slate-900/40 rounded-3xl animate-pulse border border-slate-800/80" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 p-12 text-center rounded-3xl">
            <p className="text-slate-400 text-sm">No articles found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
