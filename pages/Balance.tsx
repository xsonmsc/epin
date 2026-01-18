import React, { useState } from 'react';
import { useApp } from '../store';
import { Wallet, Upload, Send, CreditCard, ArrowLeft, Coins, TrendingUp, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Balance = () => {
  const { user, paymentMethods, placeBalanceOrder, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(10);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/auth');
  }, [isAuthenticated, navigate]);

  const handleTopUpSubmit = async () => {
    if(!selectedMethod || !receiptFile || amount <= 0) return;
    setIsSubmitting(true);
    await placeBalanceOrder(amount, selectedMethod, receiptFile);
    setIsSubmitting(false);
    alert("Balans artırma sorğusu göndərildi! Admin təsdiqindən sonra balansınıza əlavə olunacaq.");
    navigate('/profile');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gaming-dark py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gaming-neon/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gaming-accent/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <button onClick={() => navigate('/profile')} className="flex items-center text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" /> Profilə Qayıt
        </button>

        <div className="text-center mb-10 animate-fade-in">
             <div className="w-24 h-24 bg-gradient-to-br from-gaming-neon to-gaming-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gaming-neon/20">
                 <Wallet className="w-10 h-10 text-white" />
             </div>
             <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Balans Artırma</h1>
             <p className="text-gray-400">Hesabınızı artırın və istədiyiniz məhsulu anında əldə edin.</p>
        </div>

        <div className="bg-gaming-card border border-gray-800 rounded-3xl p-8 shadow-2xl animate-fade-in delay-100">
            {/* Current Balance */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-gray-700 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Coins className="w-8 h-8 text-yellow-400" />
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Cari Balans</p>
                        <p className="text-3xl font-mono font-bold text-white">{user.balance.toFixed(2)} ₼</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" /> Aktiv
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-gray-300 font-bold mb-3 block">Məbləğ (AZN)</label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                         {[5, 10, 20, 50].map(val => (
                             <button 
                                key={val}
                                onClick={() => setAmount(val)}
                                className={`py-2 rounded-lg text-sm font-bold border transition-all ${amount === val ? 'bg-gaming-neon text-black border-gaming-neon' : 'bg-slate-900 text-gray-400 border-gray-700 hover:border-gray-500'}`}
                             >
                                 {val} ₼
                             </button>
                         ))}
                    </div>
                    <input 
                        type="number" 
                        className="w-full bg-black border border-gray-600 rounded-xl p-4 text-white text-xl font-bold focus:border-gaming-neon outline-none" 
                        value={amount} 
                        onChange={e => setAmount(parseFloat(e.target.value))} 
                        min="1"
                    />
                </div>

                <div>
                    <label className="text-gray-300 font-bold mb-3 block">Ödəniş Üsulu</label>
                    <div className="grid grid-cols-1 gap-3">
                        {paymentMethods.filter(pm => pm.isActive).map(pm => (
                            <button 
                                key={pm.id} 
                                onClick={() => setSelectedMethod(pm.id)} 
                                className={`p-4 rounded-xl border flex items-center gap-3 transition-all text-left ${selectedMethod === pm.id ? 'border-gaming-neon bg-gaming-neon/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-gray-700 bg-slate-900/50 text-gray-400 hover:bg-slate-900'}`}
                            >
                                <div className="p-2 bg-black rounded-lg">
                                     <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="font-bold block">{pm.name}</span>
                                    <span className="text-xs opacity-70">Komissiya yoxdur</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedMethod && (
                    <div className="bg-slate-800 p-4 rounded-xl text-sm text-gray-300 border-l-4 border-gaming-neon animate-fade-in">
                        <p className="font-bold text-white mb-1">Hesab Məlumatları:</p>
                        <p className="font-mono text-gaming-neon">{paymentMethods.find(p=>p.id===selectedMethod)?.details}</p>
                    </div>
                )}

                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-800/50 transition-all group" onClick={() => document.getElementById('topup-file')?.click()}>
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                             <Upload className="w-6 h-6 text-gray-400 group-hover:text-gaming-neon" />
                        </div>
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{receiptFile ? receiptFile.name : "Ödəniş qəbzini yükləyin"}</span>
                        <p className="text-xs text-gray-600 mt-1">Formatlar: JPG, PNG</p>
                        <input id="topup-file" type="file" hidden accept="image/*" onChange={(e) => e.target.files && setReceiptFile(e.target.files[0])} />
                </div>

                <button 
                    onClick={handleTopUpSubmit} 
                    disabled={isSubmitting || !selectedMethod || !receiptFile}
                    className="w-full bg-gradient-to-r from-gaming-neon to-cyan-400 text-black font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                    {isSubmitting ? 'Göndərilir...' : (
                        <>
                           <ShieldCheck className="w-5 h-5" /> Təsdiqlə və Göndər
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;