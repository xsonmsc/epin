
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, User, MessageCircle } from 'lucide-react';
import { useApp } from '../store';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, cart, openCart } = useApp();

  // Hide on Admin and Auth pages (and Checkout Page itself, though we use drawer mostly)
  if (location.pathname.startsWith('/admin') || location.pathname === '/auth') {
      return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleProfileClick = () => {
      if (user) {
          navigate('/profile');
      } else {
          navigate('/auth');
      }
  };

  const navItems = [
      { icon: Home, label: 'Ana Səhifə', path: '/' },
      { icon: LayoutGrid, label: 'Kateqoriyalar', path: '/categories' },
      { icon: ShoppingCart, label: 'Səbət', action: openCart, badge: cart.length },
      { icon: MessageCircle, label: 'Dəstək', path: '/contact' },
      { icon: User, label: 'Hesabım', action: handleProfileClick, path: '/profile' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0F1115]/95 backdrop-blur-xl border-t border-white/10 z-[60] pb-safe pt-2">
        <div className="grid grid-cols-5 items-end h-[60px] pb-2">
            {navItems.map((item, idx) => {
                const active = item.path ? isActive(item.path) : false;
                
                return (
                    <button 
                        key={idx}
                        onClick={item.action || (() => navigate(item.path!))}
                        className={`flex flex-col items-center justify-center gap-1 h-full w-full relative group`}
                    >
                        <div className={`relative p-1 transition-all duration-300 ${active ? 'transform -translate-y-1' : ''}`}>
                            <item.icon 
                                className={`w-6 h-6 transition-colors duration-300 ${active ? 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'text-gray-500 group-active:scale-90'}`} 
                                strokeWidth={active ? 2.5 : 2}
                            />
                            {item.badge !== undefined && item.badge > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0F1115] shadow-lg shadow-primary/50">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] font-medium transition-colors ${active ? 'text-white' : 'text-gray-500'}`}>
                            {item.label}
                        </span>
                        {active && <div className="absolute bottom-0 w-8 h-1 bg-primary rounded-t-full shadow-[0_0_10px_#8B5CF6]"></div>}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default BottomNav;
