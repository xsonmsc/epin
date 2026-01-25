
import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight, CreditCard, Wallet, Upload } from 'lucide-react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';

const CartWidget = () => {
  const { cart, updateCartQuantity, removeFromCart, isCartOpen, openCart, closeCart, placeOrder, paymentMethods, user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [selectedMethod, setSelectedMethod] = useState<string | 'BALANCE' | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
     if(!isAuthenticated) {
         closeCart();
         navigate('/auth');
         return;
     }
     
     if(!selectedMethod) return;
     if (selectedMethod !== 'BALANCE' && !receiptFile) {
         alert("Zəhmət olmasa qəbz yükləyin.");
         return;
     }

     setIsSubmitting(true);
     const success = await placeOrder(selectedMethod, receiptFile || undefined);
     setIsSubmitting(false);
     
     if (success) {
        setCheckoutStep('cart');
        setSelectedMethod(null);
        setReceiptFile(null);
        closeCart();
        navigate('/profile'); 
     }
  };

  const reset = () => {
      setCheckoutStep('cart');
      setSelectedMethod(null);
      setReceiptFile(null);
      closeCart();
  }

  return (
    <>
      {/* Floating Trigger Button (Hidden on Mobile, Positioned left of Chat on Desktop) */}
      <button 
        onClick={openCart}
        className="hidden md:flex items-center justify-center fixed bottom-6 right-24 z-50 bg-gradient-to-tr from-primary to-secondary w-14 h-14 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-110 transition-transform active:scale-95 group"
      >
        <ShoppingCart className="w-7 h-7 text-white" />
        {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#0F1115] animate-bounce">
                {cart.length}
            </span>
        )}
      </button>

      {/* Backdrop */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm transition-opacity" onClick={reset} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface/95 border-l border-white/10 z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col backdrop-blur-xl ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         
         {/* Header */}
         <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                {checkoutStep === 'cart' ? 'Səbətiniz' : 'Ödəniş'}
                {checkoutStep === 'cart' && <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">{cart.length}</span>}
            </h2>
            <button onClick={reset} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full"><X /></button>
         </div>

         {/* Items */}
         <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                    <div className="w-24 h-24 bg-surfaceHighlight rounded-full flex items-center justify-center mb-2">
                        <ShoppingCart className="w-10 h-10 opacity-30" />
                    </div>
                    <p className="font-medium text-lg">Səbətiniz boşdur</p>
                    <button onClick={reset} className="text-primary hover:text-white transition-colors">Alış-verişə davam et</button>
                </div>
            ) : checkoutStep === 'cart' ? (
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
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-gray-400 uppercase text-xs font-bold mb-3">Ödəniş Metodu</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedMethod('BALANCE')}
                                className={`w-full p-3 rounded-xl border flex items-center justify-between gap-2 transition-all text-sm text-left
                                    ${selectedMethod === 'BALANCE' 
                                    ? 'border-gaming-neon bg-gaming-neon/10' 
                                    : 'border-white/10 bg-slate-900 hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-black/40 p-2 rounded-lg"><Wallet className="w-4 h-4 text-purple-400" /></div>
                                    <span className="text-white font-bold">Balansdan Ödə</span>
                                </div>
                                <span className="text-gray-400 text-xs">{user?.balance.toFixed(2)} ₼</span>
                            </button>
                            
                            {paymentMethods.filter(pm => pm.isActive).map(pm => (
                                <button
                                    key={pm.id}
                                    onClick={() => setSelectedMethod(pm.id)}
                                    className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all text-sm text-left
                                        ${selectedMethod === pm.id 
                                        ? 'border-gaming-neon bg-gaming-neon/10' 
                                        : 'border-white/10 bg-slate-900 hover:bg-white/5'}`}
                                >
                                    <div className="bg-black/40 p-2 rounded-lg"><CreditCard className="w-4 h-4 text-gray-400" /></div>
                                    <span className="text-white font-bold">{pm.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedMethod && selectedMethod !== 'BALANCE' && (
                        <div className="animate-fade-in">
                            <div className="bg-slate-900 p-4 rounded-xl text-sm border-l-4 border-primary mb-4">
                                <p className="text-gray-400 text-xs uppercase font-bold mb-1">Hesab:</p>
                                <p className="font-mono text-white mb-2">{paymentMethods.find(p=>p.id===selectedMethod)?.details}</p>
                                <p className="text-xs text-gray-500">{paymentMethods.find(p=>p.id===selectedMethod)?.instructions}</p>
                            </div>

                            <div className="relative border-2 border-dashed border-white/20 rounded-xl p-6 hover:bg-white/5 transition-colors text-center cursor-pointer">
                                <input type="file" accept="image/*" onChange={(e) => e.target.files && setReceiptFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-300 font-bold">
                                    {receiptFile ? <span className="text-green-400">{receiptFile.name}</span> : "Qəbz yüklə"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
         </div>

         {/* Footer */}
         <div className="p-6 border-t border-white/5 bg-black/20">
            <div className="flex justify-between mb-6">
                <span className="text-gray-400">Cəmi Məbləğ</span>
                <span className="text-2xl font-bold text-white">{subTotal.toFixed(2)} <span className="text-primary">₼</span></span>
            </div>
            
            {checkoutStep === 'cart' ? (
                <button 
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    disabled={cart.length === 0}
                >
                    Sifarişi Rəsmiləşdir <ArrowRight className="w-5 h-5" />
                </button>
            ) : (
                <div className="flex gap-2">
                    <button onClick={() => setCheckoutStep('cart')} className="px-4 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold">Geri</button>
                    <button 
                        onClick={handleCheckout}
                        disabled={!selectedMethod || (selectedMethod !== 'BALANCE' && !receiptFile) || isSubmitting}
                        className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? '...' : 'Təsdiqlə'} <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}
         </div>
      </div>
    </>
  );
};

export default CartWidget;
