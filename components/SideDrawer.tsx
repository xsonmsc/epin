
import React from 'react';
import { useApp } from '../store';
import { X, ChevronRight, Zap, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { categories } = useApp();

  // "Quick Links" simulyasiyası (Populyar kateqoriyalar + Bakiye Yükle)
  // Real proyektde bunlar Admin Panelden gele biler
  const quickLinks = [
      { id: 'balance', name: 'Bakiye Yükle', path: '/balance', icon: 'wallet' },
      ...categories.filter(c => c.isPopular).map(c => ({ id: c.id, name: c.name, path: `/category/${c.id}`, icon: 'game' })),
      { id: 'all', name: 'Tüm Oyunlar', path: '/categories', icon: 'all' }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#0F1115] border-r border-white/10 z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Section */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-primary/5 to-transparent">
            <span className="text-xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">MENYU</span>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Links Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {quickLinks.map(link => (
                <Link 
                    key={link.id} 
                    to={link.path} 
                    onClick={onClose}
                    className={`flex items-center gap-4 p-4 rounded-xl border border-transparent transition-all group relative overflow-hidden
                        ${link.id === 'balance' 
                            ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                            : 'bg-white/5 hover:bg-white/10 hover:border-white/10 hover:shadow-lg'}`}
                >
                    {/* Icon Placeholder */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${link.id === 'balance' ? 'bg-primary text-black' : 'bg-black/40 text-gray-400 group-hover:text-white'}`}>
                        {link.id === 'balance' ? <Zap className="w-5 h-5 fill-current" /> : <Gamepad2 className="w-5 h-5" />}
                    </div>

                    <span className={`text-sm font-bold tracking-wide flex-1 ${link.id === 'balance' ? 'text-primary drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]' : 'text-gray-300 group-hover:text-white'}`}>
                        {link.name}
                    </span>
                    
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${link.id === 'balance' ? 'text-primary' : 'text-gray-600 group-hover:text-white'}`} />
                </Link>
            ))}
        </div>

        {/* Footer Decor */}
        <div className="p-4">
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
