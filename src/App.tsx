import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArchivePage from './pages/ArchivePage';
import HeroSlider from './components/HeroSlider';
import OutputGrid from './components/OutputGrid';
import WorkDetailPage from './pages/WorkDetailPage';


// Admin Imports
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import OutputManager from './pages/admin/OutputManager';
import SliderManager from './pages/admin/SliderManager';

import SnowEffect from './components/SnowEffect';
import { useState } from 'react';

// Public Layout Component
function PublicLayout() {
  const [isSnowing, setIsSnowing] = useState(false);
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/work/');

  return (
    <div className="flex flex-col min-h-screen font-sans text-black dark:text-white bg-white dark:bg-black selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black dark">
      {isSnowing && <SnowEffect />}
      {!isDetailPage && <Navbar />}
      <button
        onClick={() => setIsSnowing((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 hover:scale-110 transition-transform duration-200"
        title={isSnowing ? 'Stop Snowing' : 'Let it Snow'}
      >
        <img
          src={isSnowing ? '/stoppplz.gif' : '/letitsnow.gif?v=2'}
          alt={isSnowing ? 'Stop Snowing' : 'Let it Snow'}
          className="w-32 h-32 object-contain drop-shadow-lg"
        />
      </button>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/output" element={<ArchivePage />} />
        <Route path="/work/:id" element={<WorkDetailPage />} />
        {/* Add other routes as needed */}
        <Route path="*" element={<div className="pt-32 text-center text-4xl font-bold uppercase">Page Not Found</div>} />
      </Routes>
      <Footer />
    </div>
  );
}

function MainPage() {
  // Main page content - Snow logic moved up
  return (
    <main className="min-h-screen pt-16 sm:pt-20 relative">
      <HeroSlider />
      <OutputGrid />
    </main>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes (No Navbar/Footer) */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard default to outputs for now */}
          <Route index element={<Navigate to="/admin/outputs" replace />} />
          <Route path="outputs" element={<OutputManager />} />
          <Route path="sliders" element={<SliderManager />} />
        </Route>

        {/* Public Routes */}
        <Route path="*" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
}

export default App;