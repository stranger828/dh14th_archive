import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArchivePage from './pages/ArchivePage';
import HeroSlider from './components/HeroSlider';
import OutputGrid from './components/OutputGrid';


// Admin Imports
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import OutputManager from './pages/admin/OutputManager';
import SliderManager from './pages/admin/SliderManager';

function MainPage() {
  return (
    <main className="min-h-screen pt-16 sm:pt-20">
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
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen font-sans text-black dark:text-white bg-white dark:bg-black selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
              <Navbar />
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/output" element={<ArchivePage />} />
                {/* Add other routes as needed */}
                <Route path="*" element={<div className="pt-32 text-center text-4xl font-bold uppercase">Page Not Found</div>} />
              </Routes>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;