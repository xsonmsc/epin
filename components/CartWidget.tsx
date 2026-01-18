import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';

const CartWidget = () => {
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(timer);
  }, [cart.length]);

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gaming-card border-l border-gray-800 z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
            <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                <ShoppingCart className="w-5 h-5 text-gaming-neon" /> Səbətiniz
                <span className="bg-gaming-neon text-black text-xs px-2 py-0.5 rounded-full font-bold">{cart.length}</span>
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
         </div>

         <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium">Səbətiniz boşdur</p>
                    <button onClick={() => setIsOpen(false)} className="text-gaming-neon hover:underline text-sm">Alış-verişə davam et</button>
                </div>
            ) : (
                cart.map((item, index) => (
                    <div key={index} className="flex gap-4 bg-slate-800/40 p-3 rounded-xl border border-gray-700/50 hover:border-gaming-neon/30 transition-colors group">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-gray-700">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-white text-sm line-clamp-2 leading-tight mb-1">{item.title}</h4>
                                {item.userInput && <p className="text-[10px] text-gray-400 bg-black/30 px-1.5 py-0.5 rounded w-fit">{item.userInput}</p>}
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <div className="text-gaming-neon font-bold text-sm">{item.price.toFixed(2)} ₼</div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-slate-900 rounded-lg border border-gray-700">
                                        <button onClick={() => updateCartQuantity(index, -1)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-l-lg"><Minus className="w-3 h-3"/></button>
                                        <span className="text-xs font-bold w-6 text-center text-white">{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(index, 1)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-r-lg"><Plus className="w-3 h-3"/></button>
                                    </div>
                                    <button onClick={() => removeFromCart(index)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
         </div>

         <div className="p-5 border-t border-gray-800 bg-slate-900/80 backdrop-blur-md">
            <div className="flex justify-between mb-4">
                <span className="text-gray-400">Cəmi Məbləğ:</span>
                <span className="text-2xl font-black text-white">{subTotal.toFixed(2)} ₼</span>
            </div>
            <button 
                onClick={() => { setIsOpen(false); navigate('/cart'); }}
                className="w-full bg-gradient-to-r from-gaming-neon to-cyan-400 text-black font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cart.length === 0}
            >
                Sifarişi Rəsmiləşdir <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Floating Button (Bottom Left) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-[50] bg-gaming-card border border-gaming-neon/30 text-white p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center group ${bump ? 'scale-125 ring-2 ring-gaming-neon' : ''}`}
      >
        <ShoppingCart className="w-6 h-6 group-hover:text-gaming-neon transition-colors" />
        {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-gaming-dark shadow-sm">
                {cart.length}
            </span>
        )}
      </button>
    </>
  );
};

export default CartWidget;