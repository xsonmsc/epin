import React, { useState } from 'react';
import { useApp } from '../store';
import { Box, Sparkles, AlertCircle, X, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

const MysteryBoxes = () => {
  const { mysteryBoxes, user, isAuthenticated, openMysteryBox } = useApp();
  const navigate = useNavigate();
  
  const [openingBoxId, setOpeningBoxId] = useState<string | null>(null);
  const [wonProduct, setWonProduct] = useState<Product | null>(null);
  const [animationStep, setAnimationStep] = useState<'idle' | 'shaking' | 'revealing' | 'done'>('idle');

  const handleOpen = async (boxId: string) => {
      if(!isAuthenticated) {
          navigate('/auth');
          return;
      }
      
      const box = mysteryBoxes.find(b => b.id === boxId);
      if(!box || !user) return;

      if(user.balance < box.price) {
          alert("Balansınızda kifayət qədər vəsait yoxdur.");
          navigate('/balance');
          return;
      }

      // Start Animation Sequence
      setOpeningBoxId(boxId);
      setAnimationStep('shaking');

      // Wait for shake animation (2s)
      setTimeout(async () => {
          setAnimationStep('revealing');
          
          // Actually process logic
          const product = await openMysteryBox(boxId);
          
          // Wait a bit more for visual impact
          setTimeout(() => {
              setWonProduct(product);
              setAnimationStep('done');
          }, 1000);

      }, 2000);
  };

  const reset = () => {
      setOpeningBoxId(null);
      setWonProduct(null);
      setAnimationStep('idle');
  };

  return (
    <div className="min-h-screen bg-gaming-dark py-12 px-4 relative overflow-hidden">
        {/* CSS for Animations */}
        <style>{`
            @keyframes shake-box {
                0% { transform: translate(1px, 1px) rotate(0deg); }
                10% { transform: translate(-1px, -2px) rotate(-1deg); }
                20% { transform: translate(-3px, 0px) rotate(1deg); }
                30% { transform: translate(3px, 2px) rotate(0deg); }
                40% { transform: translate(1px, -1px) rotate(1deg); }
                50% { transform: translate(-1px, 2px) rotate(-1deg); }
                60% { transform: translate(-3px, 1px) rotate(0deg); }
                70% { transform: translate(3px, 1px) rotate(-1deg); }
                80% { transform: translate(-1px, -1px) rotate(1deg); }
                90% { transform: translate(1px, 2px) rotate(0deg); }
                100% { transform: translate(1px, -2px) rotate(-1deg); }
            }
            .animate-shake-box {
                animation: shake-box 0.5s infinite;
            }
            @keyframes glow-pulse {
                0% { box-shadow: 0 0 10px #06b6d4; }
                50% { box-shadow: 0 0 30px #06b6d4, 0 0 60px #8b5cf6; }
                100% { box-shadow: 0 0 10px #06b6d4; }
            }
            .glow-effect {
                animation: glow-pulse 2s infinite;
            }
        `}</style>

        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/20 transform rotate-12">
                    <Box className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter drop-shadow-lg">
                    Sürpriz Qutular
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Şansını yoxla! Kiçik məbləğlə dəyərli hədiyyələr qazanmaq şansı.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mysteryBoxes.map(box => {
                    const isOpening = openingBoxId === box.id && animationStep !== 'idle';
                    
                    return (
                        <div key={box.id} className="relative group">
                            {/* Card Glow Background */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-gaming-neon to-gaming-accent rounded-3xl blur opacity-20 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            
                            <div className="relative bg-gaming-card border border-gray-800 rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden">
                                
                                {/* Box Image Container */}
                                <div className={`relative w-48 h-48 mb-6 transition-transform duration-500 ${isOpening && animationStep === 'shaking' ? 'animate-shake-box' : 'group-hover:scale-110'}`}>
                                    <img 
                                        src={box.image} 
                                        alt={box.title} 
                                        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                                    />
                                    {/* Particles/Glow behind box */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-[50px] rounded-full"></div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{box.title}</h3>
                                
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-gray-400 text-sm">Qiymət:</span>
                                    <span className="text-2xl font-black text-gaming-neon">{box.price.toFixed(2)} ₼</span>
                                </div>

                                {/* Drops Preview */}
                                <div className="w-full bg-slate-900/50 rounded-xl p-3 mb-6 border border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Qazana Biləcəkləriniz</p>
                                    <div className="flex justify-center gap-2 flex-wrap">
                                        {box.possibleDrops.slice(0,3).map((drop, idx) => (
                                            <span key={idx} className="text-[10px] bg-black/40 px-2 py-1 rounded text-gray-300 border border-white/5">
                                                {drop.chance}% Şans
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleOpen(box.id)}
                                    disabled={isOpening}
                                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                        ${isOpening 
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-orange-500/20'}`}
                                >
                                    {isOpening ? 'Açılır...' : 'Qutunu Aç'} <Sparkles className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* WIN MODAL */}
        {wonProduct && animationStep === 'done' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
                <div className="bg-gaming-card border-2 border-gaming-neon rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                    
                    {/* Confetti Background Effect (CSS only simple) */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                        <div className="absolute top-10 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping delay-100"></div>
                        <div className="absolute bottom-10 left-10 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-200"></div>
                    </div>

                    <button onClick={reset} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X/></button>

                    <div className="mb-6 animate-bounce-slow">
                        <img src={wonProduct.image} className="w-40 h-40 object-cover rounded-2xl mx-auto shadow-2xl border-4 border-gaming-neon" alt={wonProduct.title} />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 uppercase italic">Təbriklər!</h2>
                    <p className="text-gray-400 mb-6">Siz bu məhsulu qazandınız:</p>
                    
                    <div className="bg-slate-900 p-4 rounded-xl border border-gray-700 mb-8">
                        <h3 className="text-xl font-bold text-gaming-neon mb-1">{wonProduct.title}</h3>
                        <p className="text-sm text-gray-500">Dəyəri: {wonProduct.price.toFixed(2)} ₼</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button onClick={() => navigate('/profile')} className="w-full bg-gaming-neon text-black font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors">
                            İnventarda Gör
                        </button>
                        <button onClick={reset} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors">
                            Yenidən Sına
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default MysteryBoxes;