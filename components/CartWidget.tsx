
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
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface/95 border-l border-white/10 z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col backdrop-blur-xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         
         {/* Header */}
         <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Səbətiniz
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">{cart.length}</span>
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full"><X /></button>
         </div>

         {/* Items */}
         <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                    <div className="w-24 h-24 bg-surfaceHighlight rounded-full flex items-center justify-center mb-2">
                        <ShoppingCart className="w-10 h-10 opacity-30" />
                    </div>
                    <p className="font-medium text-lg">Səbətiniz boşdur</p>
                    <button onClick={() => setIsOpen(false)} className="text-primary hover:text-white transition-colors">Alış-verişə davam et</button>
                </div>
            ) : (
                cart.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-2xl bg-surfaceHighlight/50 border border-white/5 hover:border-primary/30 transition-colors group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/50 shrink-0">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.title} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-white text-sm line-clamp-1">{item.title}</h4>
                                {item.userInput && <p className="text-xs text-gray-400 mt-1">{item.userInput}</p>}
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                                <div className="text-white font-bold">{item.price.toFixed(2)} <span className="text-primary text-xs">₼</span></div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-black/30 rounded-lg p-0.5">
                                        <button onClick={() => updateCartQuantity(index, -1)} className="p-1.5 text-gray-400 hover:text-white"><Minus className="w-3 h-3"/></button>
                                        <span className="text-xs font-bold w-6 text-center text-white">{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(index, 1)} className="p-1.5 text-gray-400 hover:text-white"><Plus className="w-3 h-3"/></button>
                                    </div>
                                    <button onClick={() => removeFromCart(index)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
         </div>

         {/* Footer */}
         <div className="p-6 border-t border-white/5 bg-black/20">
            <div className="flex justify-between mb-6">
                <span className="text-gray-400">Cəmi Məbləğ</span>
                <span className="text-2xl font-bold text-white">{subTotal.toFixed(2)} <span className="text-primary">₼</span></span>
            </div>
            <button 
                onClick={() => { setIsOpen(false); navigate('/cart'); }}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                disabled={cart.length === 0}
            >
                Sifarişi Rəsmiləşdir <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Floating Button - Moved to Right to avoid Balance overlap */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-24 z-[50] glass text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center group ${bump ? 'scale-110 ring-2 ring-primary' : ''}`}
      >
        <ShoppingCart className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
        {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-background shadow-sm">
                {cart.length}
            </span>
        )}
      </button>
    </>
  );
};

export default CartWidget;
