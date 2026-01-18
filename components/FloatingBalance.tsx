import React from 'react';
import { useApp } from '../store';
import { Wallet, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingBalance = () => {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-fade-in hidden md:flex">
        <div className="bg-slate-900/90 backdrop-blur-md border border-gray-700 rounded-full p-1 pl-4 pr-1 shadow-2xl flex items-center gap-3 group transition-all hover:border-gaming-neon">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold leading-none mb-0.5">Balans</span>
                <span className="text-white font-mono font-bold text-lg leading-none">{user.balance.toFixed(2)} <span className="text-gaming-neon">₼</span></span>
            </div>
            <button 
                onClick={() => navigate('/balance')}
                className="bg-gaming-neon hover:bg-cyan-400 text-black p-2 rounded-full transition-colors"
                title="Artır"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>
    </div>
  );
};

export default FloatingBalance;