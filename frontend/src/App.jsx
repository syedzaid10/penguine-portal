import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LivePolarBackground from './components/LivePolarBackground';

// Public Pages
import Home from './pages/Home';
import Library from './pages/Library';
import Datasets from './pages/Datasets';
import Gallery from './pages/Gallery';
import Activities from './pages/Activities';
import News from './pages/News';
import StudentZone from './pages/StudentZone';
import AskArchive from './pages/AskArchive';
import Login from './pages/Login';

// Console Pages
import ConsoleLayout from './pages/console/ConsoleLayout';
import UploadForm from './pages/console/UploadForm';
import MySubmissions from './pages/console/MySubmissions';
import ReviewQueue from './pages/console/ReviewQueue';
import ContentStudio from './pages/console/ContentStudio';
import UserManagement from './pages/console/UserManagement';
import AuditLogView from './pages/console/AuditLogView';
import ImpactDashboard from './pages/console/ImpactDashboard';

export default function App() {
  return (
    <div className="relative flex flex-col min-h-screen text-slate-900 font-sans">
      <LivePolarBackground />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/news" element={<News />} />
          <Route path="/student-zone" element={<StudentZone />} />
          <Route path="/ask" element={<AskArchive />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Staff Console Routes */}
          <Route path="/console" element={<ConsoleLayout />}>
            <Route index element={<Navigate to="/console/upload" replace />} />
            <Route path="upload" element={<UploadForm />} />
            <Route path="my-submissions" element={<MySubmissions />} />
            <Route path="review-queue" element={<ReviewQueue />} />
            <Route path="content-studio" element={<ContentStudio />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="audit-log" element={<AuditLogView />} />
            <Route path="impact" element={<ImpactDashboard />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
