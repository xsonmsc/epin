
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import FloatingBalance from './components/FloatingBalance';
import { AppProvider } from './store';
import ChatWidget from './components/ChatWidget';
import CartWidget from './components/CartWidget';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/auth';

  // FIX: 
  // Desktop Header (1 row ~64px) -> pt-16
  // Mobile Header (2 rows packed tight ~105px) -> pt-[105px]
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && !isAuthPage && <Navbar />}
      
      <main className={`flex-grow relative ${!isAdminPage && !isAuthPage ? 'pt-[105px] md:pt-16 pb-[80px] md:pb-0' : ''}`}>
        {children}
      </main>
      
      {!isAdminPage && !isAuthPage && <Footer />}
      {!isAdminPage && !isAuthPage && <BottomNav />}
      {!isAdminPage && !isAuthPage && <ChatWidget />}
      
      {/* CartWidget is always mounted to handle drawer state, handles its own visibility */}
      {!isAdminPage && !isAuthPage && <CartWidget />}
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
            <Route path="/page/:slug" element={<DynamicPage />} /> {/* CMS Pages */}
            <Route path="/categories" element={<AllCategories />} /> {/* Grid Categories */}
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
