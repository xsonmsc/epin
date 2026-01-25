
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ProductView from './pages/ProductView';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import News from './pages/News';
import BlogView from './pages/BlogView'; 
import Rules from './pages/Rules'; 
import DynamicPage from './pages/DynamicPage'; 
import AllCategories from './pages/AllCategories'; 
import Balance from './pages/Balance';
import Contact from './pages/Contact'; 
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import { AppProvider } from './store';
import ChatWidget from './components/ChatWidget';
import CartWidget from './components/CartWidget';
import Giveaways from './pages/Giveaways';
import MysteryBoxes from './pages/MysteryBoxes';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/auth';

  // Reduced padding-top to decrease gap between header and content
  // Desktop: pt-24 -> pt-24 (adjusted margins in Home instead)
  // Mobile: pt-20 -> pt-28 to accommodate search bar
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && !isAuthPage && <Navbar />}
      
      <main className={`flex-grow relative ${!isAdminPage && !isAuthPage ? 'pt-[110px] md:pt-24 pb-[90px] md:pb-0' : ''}`}>
        {children}
      </main>
      
      {!isAdminPage && !isAuthPage && <Footer />}
      {!isAdminPage && !isAuthPage && <BottomNav />}
      {!isAdminPage && !isAuthPage && <ChatWidget />}
      
      {/* Cart Widget contains the Drawer logic, must be present on mobile too */}
      {!isAdminPage && !isAuthPage && <CartWidget />}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      {/* @ts-ignore - Future flags needed to suppress warnings */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<BlogView />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/page/:slug" element={<DynamicPage />} /> {/* CMS Pages */}
            <Route path="/categories" element={<AllCategories />} /> {/* Grid Categories */}
            <Route path="/balance" element={<Balance />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/giveaways" element={<Giveaways />} />
            <Route path="/mystery-boxes" element={<MysteryBoxes />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
