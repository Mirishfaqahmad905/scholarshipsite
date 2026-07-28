import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocialProvider } from './context/SocialContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PrivateRoute } from './components/PrivateRoute';
import { SocialFloatingWidget } from './components/SocialFloatingWidget';
import { NewUserSubscriberModal } from './components/NewUserSubscriberModal';

import { Home } from './pages/Home';
import { Scholarships } from './pages/Scholarships';
import { ScholarshipDetail } from './pages/ScholarshipDetail';
import { BlogPage } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Login } from './pages/Login';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageScholarships } from './pages/admin/ManageScholarships';
import { ManageBlogs } from './pages/admin/ManageBlogs';
import { ManageAds } from './pages/admin/ManageAds';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageSettings } from './pages/admin/ManageSettings';
import { ManageSubscribers } from './pages/admin/ManageSubscribers';

export default function App() {
  return (
    <AuthProvider>
      <SocialProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />

                {/* Protected Admin Routes */}
                <Route element={<PrivateRoute adminOnly={true} />}>
                  <Route path="/admin" element={<AdminDashboard />}>
                    <Route path="scholarships" element={<ManageScholarships />} />
                    <Route path="blogs" element={<ManageBlogs />} />
                    <Route path="ads" element={<ManageAds />} />
                    <Route path="subscribers" element={<ManageSubscribers />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="settings" element={<ManageSettings />} />
                  </Route>
                </Route>

                {/* Fallback Catch-all Route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <SocialFloatingWidget />
            <NewUserSubscriberModal />
          </div>
        </BrowserRouter>
      </SocialProvider>
    </AuthProvider>
  );
}
