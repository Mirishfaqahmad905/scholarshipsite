import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Blog } from '../types';
import { AdBanner } from '../components/AdBanner';
import { ArrowLeft, Calendar, User as UserIcon, Share2, Tag, BookOpen } from 'lucide-react';

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        console.error('Failed to load blog detail', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Article Not Found</h2>
        <Link to="/blog" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-[#D4AF37] font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5" />
              {blog.author || 'Editorial Board'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400 font-normal">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              {new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white leading-tight">
            {blog.title}
          </h1>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-900/80 border border-slate-800 text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover Image */}
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          <img
            src={blog.coverImage || '/uploads/default-blog.jpg'}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/uploads/default-blog.jpg';
            }}
          />
        </div>

        {/* Article Body */}
        <article className="bg-slate-900/60 border border-slate-800/80 p-6 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md space-y-6 text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
          <div
            className="prose prose-invert max-w-none space-y-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Found this guide helpful?</span>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-700/60 flex items-center gap-2 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </article>

        {/* Blog Sidebar Ad Banner */}
        <AdBanner placement="blog-sidebar" />

        {/* In-Feed Ad Banner */}
        <AdBanner placement="in-feed" />
      </div>
    </div>
  );
};
