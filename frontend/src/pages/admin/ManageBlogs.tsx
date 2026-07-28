import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Blog } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Plus, Pencil, Trash2, X, AlertCircle, BookOpen, Calendar, Eye } from 'lucide-react';

export const ManageBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('/uploads/default-blog.jpg');
  const [author, setAuthor] = useState('Scholarship Admin');
  const [tags, setTags] = useState('China, CSC, Guide');
  const [published, setPublished] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setContent('<p>Write your detailed scholarship application guide here...</p>');
    setCoverImage('/uploads/default-blog.jpg');
    setAuthor('Scholarship Admin');
    setTags('Scholarships, Essay, Guide');
    setPublished(true);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setCoverImage(blog.coverImage || '/uploads/default-blog.jpg');
    setAuthor(blog.author || 'Scholarship Admin');
    setTags(blog.tags ? blog.tags.join(', ') : '');
    setPublished(blog.published !== undefined ? blog.published : true);
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setFormError('Title and content are required');
      return;
    }

    const payload = {
      title,
      content,
      coverImage,
      author,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      published,
    };

    try {
      setSubmitting(true);
      setFormError(null);

      if (editingId) {
        await axios.put(`/api/blogs/${editingId}`, payload);
      } else {
        await axios.post('/api/blogs', payload);
      }

      setShowModal(false);
      fetchBlogs();
    } catch (err: any) {
      console.error('Blog save error', err);
      setFormError(err.response?.data?.message || 'Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      await axios.delete(`/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error('Delete blog error', err);
      fetchBlogs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            Manage Blog Articles <span className="text-[#D4AF37] italic font-normal">({blogs.length})</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Publish guides, SOP advice, and news</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-900/60 animate-pulse rounded-3xl border border-slate-800/80" />
      ) : blogs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 p-8 text-center rounded-3xl">
          <p className="text-slate-400 text-xs">No blog articles found.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-[0.2em] font-bold text-[10px] border-b border-slate-800/80">
                <tr>
                  <th className="p-4">Cover</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-12 h-10 object-cover rounded-xl border border-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/uploads/default-blog.jpg';
                        }}
                      />
                    </td>
                    <td className="p-4 font-semibold text-white max-w-xs truncate">{b.title}</td>
                    <td className="p-4">{b.author || 'Admin'}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(b.publishedAt || b.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {b.tags?.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-800/80 text-[#D4AF37] text-[10px] rounded-lg font-bold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 text-slate-300 hover:text-[#D4AF37] hover:bg-slate-800/80 rounded-xl transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-serif font-semibold text-white">
                {editingId ? 'Edit Article' : 'Create Article'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-sans">
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How to Secure a CSC Scholarship 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Dr. Sarah Chen"
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="China, CSC, Essay"
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Article Content (HTML/Text)</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Full article body HTML or text...</p>"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono"
                />
              </div>

              <ImageUploader value={coverImage} onChange={(path) => setCoverImage(path)} label="Article Cover Image (Server Upload)" />

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
