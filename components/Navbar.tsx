import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Shield, Menu, X, Wallet, LogIn, ShoppingCart, Bell, CheckCircle, Info, AlertTriangle, XCircle, Heart, LogOut } from 'lucide-react';
import { useApp } from '../store';
import { Notification } from '../types';

const Navbar = () => {
  const { user, siteSettings, isAuthenticated, cart, notifications, markNotificationRead, clearNotifications, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white';

  const navLinks = [
      { name: 'Ana səhifə', path: '/' },
      { name: 'Kateqoriyalar', path: '/#categories', isHash: true }, 
      { name: 'Xəbərlər', path: '/news' }, 
      { name: 'Balans', path: isAuthenticated ? '/profile' : '/auth' },
  ];

  // Filter notifications for current user
  const myNotifications = notifications.filter(n => n.userId === user?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = myNotifications.filter(n => !n.isRead).length;
  
  // Wishlist count
  const wishlistCount = user?.wishlist?.length || 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotifIcon = (type: Notification['type']) => {
      switch(type) {
          case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
          case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
          case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
          default: return <Info className="w-4 h-4 text-white" />;
      }
  };

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  const handleNavClick = (link: {path: string, isHash?: boolean}) => {
      setIsOpen(false);
      if (link.isHash) {
          if (location.pathname === '/') {
              const el = document.getElementById(link.path.replace('/#', ''));
              if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
              navigate(link.path);
          }
      }
  };

  return (
    <nav className="bg-black border-b border-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight uppercase">
                DIGI<span className="text-gray-500">STORE</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-16 flex items-baseline space-x-8">
                {navLinks.map((link, idx) => (
                    link.isHash ? (
                        <button key={idx} onClick={() => handleNavClick(link)} className="text-gray-400 hover:text-white px-1 py-2 text-sm font-medium transition-colors uppercase tracking-wide">
                            {link.name}
                        </button>
                    ) : (
                        <Link key={idx} to={link.path} className={`${isActive(link.path)} px-1 py-2 text-sm font-medium transition-colors uppercase tracking-wide`}>
                            {link.name}
                        </Link>
                    )
                ))}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-red-500 hover:text-red-400 px-1 py-2 text-sm font-medium uppercase tracking-wide">Admin</Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden lg:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-6">
               {isAuthenticated ? (
                 <>
                  {/* Wishlist Icon */}
                  <Link to="/profile" className="text-gray-400 hover:text-white transition-colors relative">
                      <Heart className="w-5 h-5" />
                      {wishlistCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></span>
                      )}
                  </Link>

                  {/* Notification Bell */}
                  <div className="relative" ref={notifRef}>
                      <button onClick={() => setNotifOpen(!notifOpen)} className="text-gray-400 hover:text-white transition-colors relative flex">
                          <Bell className="w-5 h-5" />
                          {unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></span>
                          )}
                      </button>

                      {notifOpen && (
                          <div className="absolute right-0 mt-4 w-80 bg-gaming-card border border-gray-800 shadow-2xl overflow-hidden z-[60] animate-fade-in">
                              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black">
                                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Bildirişlər</h4>
                                  <button onClick={clearNotifications} className="text-[10px] text-gray-500 hover:text-white uppercase">Təmizlə</button>
                              </div>
                              <div className="max-h-64 overflow-y-auto">
                                  {myNotifications.length === 0 ? (
                                      <div className="p-6 text-center text-gray-500 text-xs">Bildiriş yoxdur.</div>
                                  ) : (
                                      myNotifications.map(notif => (
                                          <div 
                                            key={notif.id} 
                                            onClick={() => markNotificationRead(notif.id)}
                                            className={`p-4 border-b border-gray-800 hover:bg-black/50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-gray-900' : ''}`}
                                          >
                                              <div className="flex gap-3">
                                                  <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                                                  <div>
                                                      <p className={`text-sm ${!notif.isRead ? 'font-bold text-white' : 'text-gray-400'}`}>{notif.title}</p>
                                                      <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                                      <p className="text-[10px] text-gray-600 mt-2 text-right">{new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                                  </div>
                                              </div>
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      )}
                  </div>

                  <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="h-8 w-8 rounded bg-gray-800 flex items-center justify-center text-white text-xs font-bold border border-gray-700 group-hover:border-white transition-colors">
                      {user?.name.charAt(0)}
                    </div>
                  </Link>

                  <button onClick={handleLogout} className="text-gray-500 hover:text-white transition-colors" title="Çıxış">
                      <LogOut className="w-5 h-5" />
                  </button>
                 </>
               ) : (
                 <Link to="/auth" className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                    Giriş
                 </Link>
               )}
            </div>
          </div>

          {/* Mobile Right Section (Visible on Mobile) */}
          <div className="flex lg:hidden items-center gap-4">
             {isAuthenticated ? (
                 <Link to="/profile" className="h-8 w-8 rounded bg-gray-800 flex items-center justify-center text-white text-xs font-bold border border-gray-700">
                    {user?.name.charAt(0)}
                 </Link>
             ) : (
                 <Link to="/auth" className="text-white text-sm font-bold uppercase">Giriş</Link>
             )}

             <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (Drawer) */}
      {isOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, idx) => (
                link.isHash ? (
                    <button key={idx} onClick={() => handleNavClick(link)} className="text-gray-300 hover:text-white block px-3 py-4 text-base font-bold uppercase w-full text-left border-b border-gray-900">
                        {link.name}
                    </button>
                ) : (
                    <Link key={idx} to={link.path} onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-4 text-base font-bold uppercase border-b border-gray-900">
                        {link.name}
                    </Link>
                )
            ))}
            
            {isAuthenticated && (
              <Link to="/profile" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-4 text-base font-bold uppercase border-b border-gray-900">Profilim</Link>
            )}
             {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="text-red-500 hover:text-red-400 block px-3 py-4 text-base font-bold uppercase border-b border-gray-900">Admin Panel</Link>
            )}
            
            {isAuthenticated && (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left text-gray-500 hover:text-white block px-3 py-4 text-base font-bold uppercase">
                    Çıxış Et
                </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;