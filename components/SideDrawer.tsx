
import React from 'react';
import { useApp } from '../store';
import { X, ChevronRight, Wallet, LogIn, UserPlus, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { user, categories } = useApp();
  const navigate = useNavigate();

  // "Quick Links" simulyasiyası (Populyar kateqoriyalar)
  const quickLinks = categories.filter(c => c.isPopular).slice(0, 8);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#12141a] border-r border-white/10 z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Section */}
        <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-black text-white tracking-tighter">MENYU</span>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {user ? (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-bold text-white text-lg">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover"/> : user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white font-bold truncate">{user.name}</p>
                            <p className="text-gray-400 text-xs truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/5">
                        <div className="px-2">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Balans</p>
                            <p className="text-primary font-mono font-bold">{user.balance.toFixed(2)} ₼</p>
                        </div>
                        <button onClick={() => { navigate('/balance'); onClose(); }} className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-colors">
                            <Wallet className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/auth" onClick={onClose} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group">
                        <LogIn className="w-5 h-5 text-gray-400 group-hover:text-white mb-1" />
                        <span className="text-xs font-bold text-white">Giriş</span>
                    </Link>
                    <Link to="/auth" onClick={onClose} className="flex flex-col items-center justify-center p-3 bg-primary hover:bg-primary-dark rounded-xl border border-primary transition-all text-white">
                        <UserPlus className="w-5 h-5 mb-1" />
                        <span className="text-xs font-bold">Qeydiyyat</span>
                    </Link>
                </div>
            )}
        </div>

        {/* Links Section */}
        <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3 px-2">Populyar Oyunlar</p>
            <div className="space-y-1">
                {quickLinks.map(cat => (
                    <Link 
                        key={cat.id} 
                        to={`/category/${cat.id}`} 
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                    >
                        {cat.image ? (
                            <img src={cat.image} className="w-8 h-8 rounded-lg object-cover bg-slate-800" />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center"><Zap className="w-4 h-4 text-gray-500"/></div>
                        )}
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white flex-1">{cat.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
                    </Link>
                ))}
                
                <Link to="/categories" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all mt-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">ALL</div>
                    <span className="text-sm font-bold text-primary flex-1">Bütün Oyunlar</span>
                    <ChevronRight className="w-4 h-4 text-primary" />
                </Link>
            </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-600">v1.0.2 • DigiStore Inc.</p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
