import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import PostAd from './pages/PostAd';
import PostDetail from './pages/PostDetail';
import CategoryPage from './pages/CategoryPage';
import PromoPlans from './pages/PromoPlans';
import CommunityHub from './pages/CommunityHub';
import BusinessListingForm from './pages/BusinessListingForm';
import BusinessProfile from './pages/BusinessProfile';
import CitySelectorModal from './components/CitySelectorModal';
import AdminLayout from './pages/admin/AdminLayout';
import LocalGroups from './pages/community/LocalGroups';
import TrustCenter from './pages/community/TrustCenter';
import Events from './pages/community/Events';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Sitemap from './pages/Sitemap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

// Protected route — requires login
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" state={{ from: { pathname: '/post-ad' } }} replace />;
  return children;
};

// Wrapper for pages that include Header/Footer
const MainLayout = ({ children, onOpenCitySelector }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header onOpenCitySelector={onOpenCitySelector} />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  const [citySelectorOpen, setCitySelectorOpen] = useState(false);

  useEffect(() => {
    // Check if location is selected, if not open modal
    const location = localStorage.getItem('marketplace_location');
    if (!location) {
      setCitySelectorOpen(true);
    }
  }, []);

  return (
    <LocationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Admin routes — full screen, no Header/Footer */}
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* Main public routes */}
            <Route path="/*" element={
              <MainLayout onOpenCitySelector={() => setCitySelectorOpen(true)}>
                {citySelectorOpen && (
                  <CitySelectorModal onClose={() => setCitySelectorOpen(false)} />
                )}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/business/new" element={<ProtectedRoute><BusinessListingForm /></ProtectedRoute>} />
                  <Route path="/city/:id" element={<BusinessProfile />} />
                  <Route path="/business/:id" element={<BusinessProfile />} />
                  <Route path="/post-ad" element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/promotions" element={<PromoPlans />} />
                  <Route path="/community" element={<CommunityHub />} />
                  <Route path="/community/local-groups" element={<LocalGroups />} />
                  <Route path="/community/trust-center" element={<TrustCenter />} />
                  <Route path="/community/events" element={<Events />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </LocationProvider>
  );
}

export default App;
