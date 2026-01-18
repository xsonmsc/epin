import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Phone, KeyRound, ArrowLeft, CheckCircle, AlertCircle, FileText } from 'lucide-react';

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-confirm';

const Auth = () => {
  const [view, setView] = useState<AuthView>('login');
  const { login, register, requestPasswordReset, confirmPasswordReset } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Login/Register Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  
  // Registration Terms Checkbox
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Error & Animation State
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password Flow State
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetPhone, setResetPhone] = useState('');

  // Reset Confirm State
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      if (token) {
          setResetToken(token);
          setView('reset-confirm');
      }
  }, [location]);

  const triggerError = (msg: string) => {
      setErrorMessage(msg);
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (view === 'login') {
      const success = login(formData.email, formData.password);
      if (success) {
        if(formData.email === 'admin@gamepay.az') {
           navigate('/admin');
        } else {
           navigate('/');
        }
      } else {
        triggerError("Yanlış email və ya şifrə!");
      }
    } else if (view === 'register') {
      if(!agreeTerms) {
          triggerError("Qeydiyyatdan keçmək üçün qaydaları qəbul etməlisiniz.");
          return;
      }
      if(formData.name && formData.email && formData.phone && formData.password) {
        register(formData.name, formData.email, formData.phone, formData.password);
        navigate('/');
      } else {
          triggerError("Bütün xanaları doldurun!");
      }
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (resetPhone.length < 9) {
        triggerError("Düzgün mobil nömrə daxil edin.");
        return;
      }
      
      const success = requestPasswordReset(resetPhone);
      if(success) {
          setForgotStep(2);
      } else {
          triggerError("Nömrə tapılmadı və ya xəta baş verdi.");
      }
    }
  };

  const handleResetConfirm = (e: React.FormEvent) => {
      e.preventDefault();
      if(resetToken && newPassword.length >= 6) {
          const success = confirmPasswordReset(resetToken, newPassword);
          if(success) {
              alert("Şifrə uğurla yeniləndi! İndi giriş edə bilərsiniz.");
              setView('login');
              setNewPassword('');
              setResetToken(null);
              navigate('/auth'); 
          } else {
              triggerError("Link etibarsızdır və ya istifadə olunub.");
          }
      } else {
          triggerError("Şifrə ən az 6 simvol olmalıdır.");
      }
  };

  return (
    <div className="min-h-screen bg-gaming-dark flex items-center justify-center p-4">
      {/* Shake Animation Style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
          border-color: #ef4444 !important;
        }
      `}</style>

      <div className={`w-full max-w-md bg-gaming-card border rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300 ${errorShake ? 'border-red-500 animate-shake' : 'border-gray-800'}`}>
         {/* Background Glow */}
         <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${errorShake ? 'from-red-600 to-red-400' : 'from-gaming-neon to-gaming-accent'} transition-colors duration-300`}></div>
         
         <div className="text-center mb-8">
           <h1 className="text-3xl font-black text-white mb-2">
             {view === 'login' ? 'Xoş Gəldiniz' : view === 'register' ? 'Qeydiyyat' : view === 'reset-confirm' ? 'Yeni Şifrə' : 'Şifrəni Yenilə'}
           </h1>
           <p className="text-gray-400 text-sm">GamePay dünyasına daxil olun</p>
         </div>

         {errorMessage && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4" /> {errorMessage}
            </div>
         )}

         {view === 'reset-confirm' ? (
             <form onSubmit={handleResetConfirm} className="space-y-4 animate-fade-in">
                 <div className="relative">
                      <label className="text-xs text-gray-500 ml-1 mb-1 block">Yeni Şifrəniz</label>
                      <Lock className="absolute left-3 top-8 text-gray-500 w-5 h-5" />
                      <input 
                        type="password" 
                        placeholder="Yeni şifrə daxil edin" 
                        className="w-full bg-slate-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-gaming-neon outline-none"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                  </div>
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                       <CheckCircle className="w-4 h-4" /> Şifrəni Yenilə
                  </button>
             </form>
         ) : view === 'forgot-password' ? (
             <div className="space-y-4">
                {forgotStep === 1 ? (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div className="relative animate-fade-in">
                            <label className="text-xs text-gray-500 ml-1 mb-1 block">Mobil Nömrə</label>
                            <Phone className="absolute left-3 top-8 text-gray-500 w-5 h-5" />
                            <input 
                                type="tel" 
                                placeholder="+994 50 123 45 67" 
                                className="w-full bg-slate-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-gaming-neon outline-none"
                                value={resetPhone}
                                onChange={e => setResetPhone(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-2">Şifrə yeniləmə linki bu nömrəyə göndəriləcək.</p>
                        </div>
                        <button type="submit" className="w-full bg-gaming-neon hover:bg-cyan-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                           Linki Göndər <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-6 animate-fade-in">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8"/>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Link Göndərildi!</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Şifrə yeniləmə linki SMS vasitəsilə <b>{resetPhone}</b> nömrəsinə göndərildi. 
                        </p>
                        <button onClick={() => setView('login')} className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700">
                            Girişə Qayıt
                        </button>
                    </div>
                )}
                
                {forgotStep === 1 && (
                    <button type="button" onClick={() => setView('login')} className="w-full text-gray-400 text-sm hover:text-white mt-2 flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3"/> Geri Qayıt
                    </button>
                )}
             </div>
         ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                {view === 'register' && (
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Ad Soyad" 
                      className="w-full bg-slate-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-gaming-neon outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                )}
                {view === 'register' && (
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                    <input 
                      type="tel" 
                      placeholder="Mobil Nömrə" 
                      className="w-full bg-slate-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-gaming-neon outline-none"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                )}
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                    <input 
                      type="email" 
                      placeholder="Email ünvanı" 
                      className="w-full bg-slate-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-gaming-neon outline-none"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                    <input 
                      type="password" 
                      placeholder="Şifrə" 
                      className="w-full bg-slate-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-gaming-neon outline-none"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                {/* Terms Checkbox for Registration */}
                {view === 'register' && (
                  <div className="flex items-start gap-2 pt-2">
                     <div className="relative flex items-center">
                       <input 
                         type="checkbox" 
                         id="terms" 
                         checked={agreeTerms}
                         onChange={(e) => setAgreeTerms(e.target.checked)}
                         className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-500 bg-slate-900 checked:bg-gaming-neon checked:border-gaming-neon transition-all"
                       />
                        <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 w-3 h-3 text-black left-0.5" />
                     </div>
                     <label htmlFor="terms" className="text-xs text-gray-400 leading-tight">
                        <Link to="/rules" className="text-gaming-neon hover:underline font-bold" target="_blank">İstifadəçi Qaydaları</Link> və <Link to="/rules" className="text-gaming-neon hover:underline font-bold" target="_blank">Məxfilik Siyasətini</Link> oxudum və qəbul edirəm.
                     </label>
                  </div>
                )}

                {view === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => { setView('forgot-password'); setForgotStep(1); setResetPhone(''); setErrorMessage(''); }} className="text-xs text-gaming-neon hover:underline">
                      Şifrəni unutmusunuz?
                    </button>
                  </div>
                )}

                <button type="submit" className="w-full bg-gaming-neon hover:bg-cyan-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  {view === 'login' ? 'Daxil Ol' : 'Qeydiyyatdan Keç'} <ArrowRight className="w-4 h-4" />
                </button>
            </form>
         )}

         {view !== 'forgot-password' && view !== 'reset-confirm' && (
           <div className="mt-6 text-center">
              <button 
                onClick={() => { setView(view === 'login' ? 'register' : 'login'); setErrorMessage(''); }} 
                className="text-gray-400 text-sm hover:text-white underline decoration-gaming-accent"
              >
                {view === 'login' ? "Hesabınız yoxdur? Qeydiyyat" : "Artıq hesabınız var? Giriş"}
              </button>
           </div>
         )}
         
         <div className="mt-4 text-center border-t border-gray-800 pt-4">
             <p className="text-xs text-gray-500">Admin Girişi üçün:</p>
             <p className="text-xs text-gray-600 font-mono">admin@gamepay.az / admin</p>
         </div>
      </div>
    </div>
  );
};

export default Auth;