import React from 'react';
import { Link } from 'react-router-dom';
import { Blog } from '../types';
import { Calendar, User as UserIcon, Tag, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <article className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-lg hover:border-[#D4AF37]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group backdrop-blur-sm">
      <div>
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={blog.coverImage || '/uploads/default-blog.jpg'}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/uploads/default-blog.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-slate-400 font-sans">
            <span className="flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
              {blog.author || 'Editorial Team'}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <Link to={`/blog/${blog.slug || blog._id}`} className="block group-hover:text-[#D4AF37] transition-colors">
            <h3 className="text-xl font-serif font-semibold text-white line-clamp-2 leading-snug">
              {blog.title}
            </h3>
          </Link>

          <p
            className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans"
            dangerouslySetInnerHTML={{
              __html: blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {blog.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-slate-800/80 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-wider rounded-md border border-slate-700/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/blog/${blog.slug || blog._id}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#e0bc46] group-hover:translate-x-1 transition-all"
        >
          <span>Read Full Article</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
