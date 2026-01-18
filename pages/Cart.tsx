import React, { useState } from 'react';
import { useApp } from '../store';
import { Trash2, CreditCard, Upload, CheckCircle, ArrowRight, Minus, Plus, Tag, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROMO_CODES } from '../constants';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, paymentMethods, placeOrder, user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  const [selectedMethod, setSelectedMethod] = useState<string | 'BALANCE' | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{code: string, discountPercent: number} | null>(null);
  const [promoError, setPromoError] = useState('');

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedPromo ? (subTotal * appliedPromo.discountPercent / 100) : 0;
  const totalAmount = subTotal - discountAmount;

  const handleApplyPromo = () => {
      const found = MOCK_PROMO_CODES.find(p => p.code === promoCode.toUpperCase());
      if (found) {
          setAppliedPromo(found);
          setPromoError('');
      } else {
          setPromoError('Yanlış promo kod');
          setAppliedPromo(null);
      }
  };

  const handleCheckout = async () => {
     if(!selectedMethod) return;
     
     // Validate manual payment
     if (selectedMethod !== 'BALANCE' && !receiptFile) {
         alert("Zəhmət olmasa qəbz yükləyin.");
         return;
     }

     setIsSubmitting(true);
     // Pass undefined for receipt if paying with balance
     const success = await placeOrder(selectedMethod, receiptFile || undefined, discountAmount);
     setIsSubmitting(false);
     
     if (success) {
        setOrderComplete(true);
     }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const getSelectedPaymentDetails = () => paymentMethods.find(p => p.id === selectedMethod);

  if (orderComplete) {
    return (
        <div className="min-h-screen bg-gaming-dark flex items-center justify-center p-4">
            <div className="text-center bg-gaming-card p-8 rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full animate-fade-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Sifariş Qəbul Edildi!</h2>
                <p className="text-gray-400 mb-8">
                  {selectedMethod === 'BALANCE' 
                    ? "Ödəniş balansdan çıxıldı. Sifarişiniz emal olunur." 
                    : "Sifarişiniz manual yoxlanışa göndərildi. Ödəniş təsdiqləndikdən sonra məhsullar profilinizdə görünəcək."}
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full bg-gaming-accent hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                >
                  Sifarişlərimə Get
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark py-10 px-4">
       <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Səbətiniz</h1>

          {cart.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-gray-800">
                  <p className="text-gray-500 text-xl mb-4">Səbətiniz boşdur.</p>
                  <button onClick={() => navigate('/')} className="text-gaming-neon hover:underline">Mağazaya Keç</button>
              </div>
          ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                  {/* Cart Items */}
                  <div className="flex-1 space-y-4">
                      {cart.map((item, index) => (
                          <div key={index} className="bg-gaming-card p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-center gap-4">
                             <img src={item.image} className="w-20 h-20 rounded object-cover" alt="" />
                             <div className="flex-1 text-center sm:text-left">
                                 <h3 className="font-bold text-white">{item.title}</h3>
                                 <p className="text-gray-400 text-sm">Vahid qiymət: {item.price.toFixed(2)} ₼</p>
                                 {item.userInput && <p className="text-xs text-gray-500 mt-1">Info: {item.userInput}</p>}
                             </div>
                             
                             {/* Quantity Controls */}
                             <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1">
                                 <button onClick={() => updateCartQuantity(index, -1)} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><Minus className="w-4 h-4"/></button>
                                 <span className="font-bold text-white w-6 text-center">{item.quantity}</span>
                                 <button onClick={() => updateCartQuantity(index, 1)} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><Plus className="w-4 h-4"/></button>
                             </div>

                             <div className="text-right min-w-[80px]">
                                 <p className="text-gaming-neon font-bold text-lg">{(item.price * item.quantity).toFixed(2)} ₼</p>
                             </div>

                             <button onClick={() => removeFromCart(index)} className="text-red-500 hover:bg-red-500/10 p-2 rounded">
                                 <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                      ))}
                  </div>

                  {/* Checkout Sidebar */}
                  <div className="w-full lg:w-96">
                      <div className="bg-gaming-card p-6 rounded-xl border border-gray-800 sticky top-24">
                          <h2 className="text-xl font-bold mb-4">Sifariş Məlumatı</h2>
                          
                          {/* Promo Code */}
                          <div className="mb-6">
                              <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Promo Kod" 
                                    className="flex-1 bg-slate-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-gaming-neon outline-none uppercase"
                                    value={promoCode}
                                    onChange={e => setPromoCode(e.target.value)}
                                  />
                                  <button onClick={handleApplyPromo} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded">
                                      <Tag className="w-4 h-4" />
                                  </button>
                              </div>
                              {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                              {appliedPromo && <p className="text-green-500 text-xs mt-1 font-bold">Promo tətbiq edildi: {appliedPromo.discountPercent}% ENDİRİM</p>}
                          </div>

                          <div className="space-y-2 mb-6 border-t border-gray-700 pt-4">
                             <div className="flex justify-between text-gray-400">
                                 <span>Məhsul Dəyəri:</span>
                                 <span>{subTotal.toFixed(2)} ₼</span>
                             </div>
                             {appliedPromo && (
                                <div className="flex justify-between text-green-400">
                                    <span>Endirim:</span>
                                    <span>-{discountAmount.toFixed(2)} ₼</span>
                                </div>
                             )}
                             <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
                                 <span>Yekun:</span>
                                 <span className="text-gaming-neon">{totalAmount.toFixed(2)} ₼</span>
                             </div>
                          </div>

                          {!isAuthenticated ? (
                              <button onClick={() => navigate('/auth')} className="w-full bg-gaming-neon text-black font-bold py-3 rounded mb-4">Ödəniş üçün Daxil Ol</button>
                          ) : (
                              <>
                                <h3 className="font-bold mb-2 text-sm text-gray-400 uppercase">Ödəniş Metodu Seçin</h3>
                                <div className="space-y-2 mb-6">
                                    {/* Pay with Balance Option */}
                                    <button
                                        onClick={() => setSelectedMethod('BALANCE')}
                                        className={`w-full p-3 rounded-lg border flex items-center justify-between gap-2 transition-all text-sm text-left
                                            ${selectedMethod === 'BALANCE' 
                                            ? 'border-gaming-neon bg-gaming-neon/10' 
                                            : 'border-gray-700 bg-slate-900 hover:border-gray-500'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Wallet className="w-4 h-4 text-purple-400" />
                                            <span className="text-white font-bold">Balansdan Ödə</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">Cari: {user?.balance.toFixed(2)} ₼</span>
                                    </button>

                                    {/* Manual Methods */}
                                    {paymentMethods.filter(pm => pm.isActive).map(pm => (
                                        <button
                                        key={pm.id}
                                        onClick={() => setSelectedMethod(pm.id)}
                                        className={`w-full p-3 rounded-lg border flex items-center gap-2 transition-all text-sm text-left
                                            ${selectedMethod === pm.id 
                                            ? 'border-gaming-neon bg-gaming-neon/10' 
                                            : 'border-gray-700 bg-slate-900 hover:border-gray-500'}`}
                                        >
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <span className="text-white">{pm.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Manual Payment Details */}
                                {selectedMethod && selectedMethod !== 'BALANCE' && (
                                    <div className="mb-6 animate-fade-in">
                                        <div className="bg-slate-900 p-4 rounded mb-4 text-sm">
                                            <p className="text-gray-400 mb-1">Hesab:</p>
                                            <p className="font-mono text-white mb-2">{getSelectedPaymentDetails()?.details}</p>
                                            <p className="text-xs text-gray-500">{getSelectedPaymentDetails()?.instructions}</p>
                                        </div>

                                        <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 hover:bg-slate-800/50 transition-colors text-center cursor-pointer">
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <p className="text-xs text-gray-300">
                                                {receiptFile ? <span className="text-green-400">{receiptFile.name}</span> : "Qəbz yüklə"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={handleCheckout}
                                    disabled={!selectedMethod || (selectedMethod !== 'BALANCE' && !receiptFile) || isSubmitting}
                                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2
                                    ${(!selectedMethod || (selectedMethod !== 'BALANCE' && !receiptFile) || isSubmitting) 
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                >
                                    {isSubmitting ? 'Yoxlanılır...' : 'Sifarişi Tamamla'} <ArrowRight className="w-4 h-4"/>
                                </button>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          )}
       </div>
    </div>
  );
};

export default Cart;