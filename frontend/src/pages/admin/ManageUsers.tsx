import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Category, Country } from '../../types';
import { Users, Shield, Trash2, Plus, Globe, Tag, AlertCircle } from 'lucide-react';

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [newCat, setNewCat] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, metaRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/scholarships/meta/options'),
      ]);
      setUsers(usersRes.data);
      setCategories(metaRes.data.categories || []);
      setCountries(metaRes.data.countries || []);
    } catch (err) {
      console.error('Failed to load user management data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`/api/users/${user._id}`, { role: newRole });
      fetchData();
    } catch (err) {
      console.error('Role update error', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      await axios.delete(`/api/users/${id}`);
      fetchData();
    } catch (err) {
      console.error('User deletion error', err);
      fetchData();
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await axios.post('/api/users/categories', { name: newCat.trim() });
      setNewCat('');
      setMsg('Category added!');
      setTimeout(() => setMsg(null), 2500);
      fetchData();
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Error adding category');
    }
  };

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry.trim()) return;
    try {
      await axios.post('/api/users/countries', { name: newCountry.trim() });
      setNewCountry('');
      setMsg('Country added!');
      setTimeout(() => setMsg(null), 2500);
      fetchData();
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Error adding country');
    }
  };

  return (
    <div className="space-y-8">
      {msg && (
        <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-2xl text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* User Accounts Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            Registered Users <span className="text-[#D4AF37] italic font-normal">({users.length})</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">View user accounts and manage admin roles</p>
        </div>

        {loading ? (
          <div className="h-48 bg-slate-900/60 animate-pulse rounded-3xl border border-slate-800/80" />
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-[0.2em] font-bold text-[10px] border-b border-slate-800/80">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 text-slate-400">{u.email}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleRole(u)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                            u.role === 'admin'
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {u.role}
                        </button>
                      </td>
                      <td className="p-4 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                          title="Delete User"
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
      </div>

      {/* Quick Add Categories & Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Categories */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base">
            <Tag className="w-4 h-4" />
            <span>Manage Categories ({categories.length})</span>
          </div>

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Merit-based, STEM"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {categories.map((c) => (
              <span key={c._id || c.name} className="px-3 py-1 bg-slate-950/80 border border-slate-800 text-xs text-slate-300 rounded-xl">
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Manage Countries */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base">
            <Globe className="w-4 h-4" />
            <span>Manage Destinations ({countries.length})</span>
          </div>

          <form onSubmit={handleAddCountry} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Singapore, France"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 pt-2 max-h-36 overflow-y-auto">
            {countries.map((c) => (
              <span key={c._id || c.name} className="px-3 py-1 bg-slate-950/80 border border-slate-800 text-xs text-slate-300 rounded-xl">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
