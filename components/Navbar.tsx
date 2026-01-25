
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, ChevronDown, User as UserIcon, Heart, Search, LogIn, UserPlus, Plus } from 'lucide-react';
import { useApp } from '../store';
import { Notification } from '../types';

const Navbar = () => {
  const { user, isAuthenticated, notifications, markNotificationRead, clearNotifications, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(searchQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
          setIsOpen(false); // Close mobile menu if open
      }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'Kateqoriyalar', path: '/#categories' }, 
      { name: 'Xəbərlər', path: '/news' }, 
      { name: 'Qaydalar', path: '/rules' },
      { name: 'Əlaqə', path: '/contact' },
  ];

  const myNotifications = notifications.filter(n => n.userId === user?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
      logout();
      navigate('/');
      setProfileOpen(false);
  };

  const handleLinkClick = (path: string) => {
    if (path.startsWith('/#')) {
        const id = path.replace('/#', '');
        if (location.pathname !== '/') {
             navigate('/');
             setTimeout(() => {
                 const el = document.getElementById(id);
                 if(el) el.scrollIntoView({behavior: 'smooth'});
             }, 100);
        } else {
            const el = document.getElementById(id);
            if(el) el.scrollIntoView({behavior: 'smooth'});
        }
    } else {
        navigate(path);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'glass border-white/5 h-20' : 'bg-transparent border-transparent h-24'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              D
            </div>
            <span className="text-2xl font-bold text-white tracking-tight hidden sm:block">
              GAME<span className="text-primary font-light">PAY</span>
            </span>
          </Link>
            
          {/* Desktop Search & Nav */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
              <div className="flex items-center space-x-1 mr-6">
                {navLinks.map((link, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => handleLinkClick(link.path)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            isActive(link.path) 
                            ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {link.name}
                    </button>
                ))}
              </div>
              
              <form onSubmit={handleSearch} className="relative w-64 group">
                  <input 
                    type="text" 
                    placeholder="Məhsul axtar..." 
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:w-80 focus:bg-black/40 focus:border-primary transition-all duration-300 outline-none placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
              </form>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
               {isAuthenticated ? (
                 <>
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                      <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-400 hover:text-white transition-colors">
                          <Bell className="w-6 h-6" />
                          {unreadCount > 0 && (
                              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-background animate-pulse"></span>
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
                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-white/10 hover:bg-white/5 transition-all bg-black/20"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="text-left hidden lg:block">
                            <p className="text-xs font-bold text-white leading-none mb-0.5">{user?.name}</p>
                            <p className="text-[10px] text-primary font-mono">{user?.balance.toFixed(2)} ₼</p>
                        </div>
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform mr-2 ${profileOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {profileOpen && (
                          <div className="absolute right-0 mt-4 w-56 glass border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up origin-top-right">
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
                 <div className="flex items-center gap-2">
                     <Link to="/auth" className="text-white text-sm font-bold hover:text-primary transition-colors px-3 py-2">
                        Daxil Ol
                     </Link>
                     <Link to="/auth" className="bg-white text-background px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Qeydiyyat
                     </Link>
                 </div>
               )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
             <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 bg-white/5 rounded-lg border border-white/10">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10 absolute top-full w-full animate-slide-up h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4 space-y-4">
            
            {/* User Info Card (Mobile) */}
            {isAuthenticated && (
                <div className="bg-gradient-to-br from-surface to-surfaceHighlight p-4 rounded-2xl border border-white/10 flex flex-col gap-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg">{user?.name}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Balans</p>
                            <p className="text-xl font-mono text-primary font-bold">{user?.balance.toFixed(2)} ₼</p>
                        </div>
                        <button onClick={() => { navigate('/balance'); setIsOpen(false); }} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" /> Artır
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
                <input 
                    type="text" 
                    placeholder="Axtar..." 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            </form>

            <div className="space-y-1">
                {navLinks.map((link, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => { handleLinkClick(link.path); setIsOpen(false); }}
                        className={`block w-full text-left px-4 py-4 rounded-xl text-base font-medium border border-transparent ${
                            isActive(link.path) ? 'bg-white/10 text-white border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {link.name}
                    </button>
                ))}
            </div>

            <div className="h-px bg-white/10 my-2"></div>

            {!isAuthenticated ? (
                 <div className="grid grid-cols-2 gap-4">
                     <Link to="/auth" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-base font-bold text-white bg-white/5 border border-white/10">
                         <LogIn className="w-4 h-4"/> Giriş
                     </Link>
                     <Link to="/auth" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-base font-bold text-black bg-primary">
                         <UserPlus className="w-4 h-4"/> Qeydiyyat
                     </Link>
                 </div>
            ) : (
                <div className="space-y-2">
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-center px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10">
                        Profilə Get
                    </Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-center px-4 py-4 rounded-xl text-base font-bold text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10">
                        Çıxış Et
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
