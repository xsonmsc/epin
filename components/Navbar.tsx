import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, ChevronDown, User as UserIcon, Heart, Search } from 'lucide-react';
import { useApp } from '../store';
import { Notification } from '../types';

const Navbar = () => {
  const { user, isAuthenticated, notifications, markNotificationRead, clearNotifications, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
      { name: 'Mağaza', path: '/' },
      { name: 'Xəbərlər', path: '/news' }, 
      { name: 'Əlaqə', path: '/contact' },
  ];

  const myNotifications = notifications.filter(n => n.userId === user?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
      logout();
      navigate('/');
      setProfileOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'glass border-white/10 h-16' : 'bg-transparent border-transparent h-20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              D
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              DIGI<span className="text-primary font-light">STORE</span>
            </span>
          </Link>
            
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, idx) => (
                <Link 
                    key={idx} 
                    to={link.path} 
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive(link.path) 
                        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {link.name}
                </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
               {/* Search Trigger (Visual Only for now) */}
               <button className="text-gray-400 hover:text-white transition-colors">
                   <Search className="w-5 h-5" />
               </button>

               {isAuthenticated ? (
                 <>
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                      <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-400 hover:text-white transition-colors">
                          <Bell className="w-5 h-5" />
                          {unreadCount > 0 && (
                              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"></span>
                          )}
                      </button>

                      {notifOpen && (
                          <div className="absolute right-0 mt-4 w-80 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up origin-top-right">
                              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                  <h4 className="text-sm font-bold text-white">Bildirişlər</h4>
                                  <button onClick={clearNotifications} className="text-xs text-primary hover:text-primary-dark">Təmizlə</button>
                              </div>
                              <div className="max-h-64 overflow-y-auto">
                                  {myNotifications.length === 0 ? (
                                      <div className="p-8 text-center text-gray-500 text-sm">Bildiriş yoxdur.</div>
                                  ) : (
                                      myNotifications.map(notif => (
                                          <div 
                                            key={notif.id} 
                                            onClick={() => markNotificationRead(notif.id)}
                                            className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
                                          >
                                              <p className={`text-sm ${!notif.isRead ? 'font-semibold text-white' : 'text-gray-400'}`}>{notif.title}</p>
                                              <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                      <button 
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-white/10 hover:bg-white/5 transition-all"
                      >
                        <div className="h-7 w-7 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            {user?.name.charAt(0)}
                        </div>
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {profileOpen && (
                          <div className="absolute right-0 mt-4 w-56 glass border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up origin-top-right">
                              <div className="px-3 py-2 border-b border-white/5 mb-2">
                                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                  <p className="text-xs text-primary mt-1 font-mono">{user?.balance.toFixed(2)} ₼</p>
                              </div>
                              
                              <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                  <UserIcon className="w-4 h-4" /> Profil
                              </Link>
                              
                              <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                  <Heart className="w-4 h-4" /> İstək siyahısı
                              </Link>

                              {user?.role === 'admin' && (
                                <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                                    Admin Panel
                                </Link>
                              )}
                              
                              <div className="h-px bg-white/5 my-2"></div>
                              
                              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                                  <LogOut className="w-4 h-4" /> Çıxış
                              </button>
                          </div>
                      )}
                  </div>
                 </>
               ) : (
                 <Link to="/auth" className="bg-white text-background px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Giriş
                 </Link>
               )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
             {isAuthenticated && (
                <Link to="/profile" className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                    {user?.name.charAt(0)}
                </Link>
             )}
             <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10 absolute top-full w-full animate-slide-up">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link, idx) => (
                <Link 
                    key={idx} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)} 
                    className={`block px-4 py-3 rounded-xl text-base font-medium ${
                        isActive(link.path) ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    {link.name}
                </Link>
            ))}
            {!isAuthenticated && (
                 <Link to="/auth" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-bold text-white bg-primary/20">
                     Giriş
                 </Link>
            )}
             {isAuthenticated && (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-400">
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