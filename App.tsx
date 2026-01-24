
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductView from './pages/ProductView';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import News from './pages/News';
import BlogView from './pages/BlogView'; 
import Rules from './pages/Rules';
import Balance from './pages/Balance';
import Contact from './pages/Contact'; 
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import FloatingBalance from './components/FloatingBalance';
import { AppProvider, useApp } from './store';
import { MessageCircle, Instagram, Send, Smartphone } from 'lucide-react';
import ChatWidget from './components/ChatWidget';
import CartWidget from './components/CartWidget';

const Footer = () => {
   const { siteSettings } = useApp();
   return (
     <footer className="bg-slate-950 border-t border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
            {siteSettings.logoUrl && (
                <img src={siteSettings.logoUrl} alt="Logo" className="h-10 mx-auto mb-4" />
            )}
            <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">{siteSettings.footerText}</p>
            
            <div className="flex justify-center gap-6 mb-6">
                {siteSettings.socials?.instagram && (
                    <a href={siteSettings.socials.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors"><Instagram className="w-6 h-6"/></a>
                )}
                {siteSettings.socials?.telegram && (
                    <a href={siteSettings.socials.telegram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><Send className="w-6 h-6"/></a>
                )}
                 {siteSettings.socials?.tiktok && (
                    <a href={siteSettings.socials.tiktok} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Smartphone className="w-6 h-6"/></a>
                )}
                {siteSettings.socials?.whatsapp && (
                    <a href={siteSettings.socials.whatsapp} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-500 transition-colors"><MessageCircle className="w-6 h-6"/></a>
                )}
            </div>
            
            <p className="text-xs text-gray-600">WhatsApp Dəstək: {siteSettings.whatsappNumber}</p>
        </div>
     </footer>
   )
}

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && !isAuthPage && <Navbar />}
      <main className="flex-grow relative">
        {children}
      </main>
      {!isAdminPage && !isAuthPage && <Footer />}
      {!isAdminPage && !isAuthPage && <ChatWidget />}
      {!isAdminPage && !isAuthPage && <CartWidget />}
      {!isAdminPage && !isAuthPage && <FloatingBalance />}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<BlogView />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
