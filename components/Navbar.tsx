
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User as UserIcon, Heart, Search, LogOut, Menu, Plus, Wallet } from 'lucide-react';
import { useApp } from '../store';
import SideDrawer from './SideDrawer';

const Navbar = () => {
  const { user, isAuthenticated, notifications, markNotificationRead, clearNotifications, logout } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Scroll Behavior State
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Background effect threshold
        setScrolled(currentScrollY > 10);

        // Hide/Show logic
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setVisible(false); // Scrolling down
        } else {
            setVisible(true); // Scrolling up
        }
        lastScrollY.current = currentScrollY;
    };

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
      }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'Kateqoriyalar', path: '/categories' }, 
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
    <>
    <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    
    <nav className={`fixed w-full z-50 transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'} ${scrolled ? 'bg-[#0F1115]/95 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP LAYOUT */}
        <div className="hidden md:flex items-center justify-between h-20 gap-6">
            
            {/* Left: Drawer & Logo */}
            <div className="flex items-center gap-4 shrink-0">
                <button onClick={() => setDrawerOpen(true)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">D</div>
                    <span className="text-xl font-bold text-white tracking-tight">GAME<span className="text-primary font-light">PAY</span></span>
                </Link>
            </div>

            {/* Middle: Links & Search */}
            <div className="flex-1 flex items-center justify-center gap-6">
                <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
                    {navLinks.map((link, idx) => (
                        <Link 
                            key={idx} 
                            to={link.path}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.path) ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                
                <form onSubmit={handleSearch} className="relative w-64 group">
                    <input 
                        type="text" 
                        placeholder="Məhsul axtar..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:w-72 focus:bg-black/40 focus:border-primary transition-all duration-300 outline-none placeholder-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                </form>
            </div>

            {/* Right: Balance & User */}
            <div className="flex items-center gap-4 shrink-0">
                {isAuthenticated ? (
                    <>
                        {/* Balance Top-Up Button (Desktop) */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 pr-3">
                            <button onClick={() => navigate('/balance')} className="bg-primary hover:bg-primary-dark text-white p-1.5 rounded-lg transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-[10px] text-gray-400 font-bold">BALANS</span>
                                <span className="text-sm font-mono font-bold text-white">{user?.balance.toFixed(2)} ₼</span>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/5">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                            </button>
                            {/* ... Notif Dropdown (Same as before) ... */}
                            {notifOpen && (
                                <div className="absolute right-0 mt-4 w-80 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up origin-top-right">
                                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                        <h4 className="text-sm font-bold text-white">Bildirişlər</h4>
                                        <button onClick={clearNotifications} className="text-xs text-primary hover:text-primary-dark">Təmizlə</button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {myNotifications.length === 0 ? <div className="p-8 text-center text-gray-500 text-sm">Bildiriş yoxdur.</div> : myNotifications.map(notif => (
                                            <div key={notif.id} onClick={() => markNotificationRead(notif.id)} className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                                                <p className={`text-sm ${!notif.isRead ? 'font-semibold text-white' : 'text-gray-400'}`}>{notif.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                                    {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-lg"/> : user?.name.charAt(0)}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {/* Profile Dropdown ... */}
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
                    <div className="flex items-center gap-3">
                        <Link to="/auth" className="text-white font-bold hover:text-primary transition-colors text-sm">Daxil Ol</Link>
                        <Link to="/auth" className="bg-white text-black px-5 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 text-sm">Qeydiyyat</Link>
                    </div>
                )}
            </div>
        </div>

        {/* MOBILE LAYOUT (2 Rows) */}
        <div className="md:hidden flex flex-col py-3 gap-3">
            {/* Row 1: Menu, Logo, Balance, Notif */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setDrawerOpen(true)} className="p-2 bg-white/5 rounded-lg text-gray-300 border border-white/10">
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link to="/" className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">D</div>
                        <span className="font-bold text-white text-lg">GAME<span className="text-primary">PAY</span></span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated && (
                        <div onClick={() => navigate('/balance')} className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg active:scale-95 transition-transform">
                            <span className="text-sm font-mono font-bold text-primary">{user?.balance.toFixed(2)} ₼</span>
                            <div className="bg-primary rounded-md p-0.5"><Plus className="w-3 h-3 text-white"/></div>
                        </div>
                    )}
                    <button onClick={() => isAuthenticated ? setNotifOpen(!notifOpen) : navigate('/auth')} className="relative p-2 text-gray-400">
                        <Bell className="w-6 h-6" />
                        {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span>}
                    </button>
                </div>
            </div>

            {/* Row 2: Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full">
                <input 
                    type="text" 
                    placeholder="Oyun, UC, VP axtar..." 
                    className="w-full bg-surfaceHighlight border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary outline-none shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            </form>
        </div>

      </div>
    </nav>
    </>
  );
};

export default Navbar;
