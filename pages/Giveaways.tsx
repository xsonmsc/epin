import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { Gift, Clock, Users, Trophy, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Giveaways = () => {
  const { giveaways, user, joinGiveaway, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJoin = (id: string) => {
      if(!isAuthenticated) {
          navigate('/auth');
          return;
      }
      joinGiveaway(id);
  };

  const getTimeLeft = (endDate: string) => {
      const diff = new Date(endDate).getTime() - now;
      if (diff <= 0) return null;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${days}g ${hours}s ${minutes}d ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gaming-dark py-12 px-4 relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
             <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-gaming-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20 animate-bounce-slow">
                    <Gift className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter drop-shadow-lg">
                    Hədiyyəli Oyunlar
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Pulsuz iştirak et və dəyərli hədiyyələr qazan! Şansını yoxla.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {giveaways.map((giveaway) => {
                    const timeLeft = getTimeLeft(giveaway.endDate);
                    const isEnded = !timeLeft || giveaway.status === 'ENDED';
                    const isJoined = user && giveaway.participants.includes(user.id);

                    return (
                        <div key={giveaway.id} className="bg-gaming-card border border-gray-800 rounded-2xl overflow-hidden hover:border-gaming-neon/50 transition-all duration-300 group shadow-2xl flex flex-col">
                            {/* Image Header */}
                            <div className="h-56 relative overflow-hidden">
                                <img src={giveaway.image} alt={giveaway.title} className={`w-full h-full object-cover transition-transform duration-700 ${isEnded ? 'grayscale' : 'group-hover:scale-110'}`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-gaming-card via-transparent to-transparent"></div>
                                
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    {isEnded ? (
                                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">BİTDİ</span>
                                    ) : (
                                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">AKTİV</span>
                                    )}
                                </div>
                                
                                {/* Prize Badge */}
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                     <Trophy className="w-4 h-4 text-yellow-400" />
                                     <span className="text-white font-bold text-sm">{giveaway.prizeValue}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{giveaway.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-3">{giveaway.description}</p>
                                
                                <div className="mt-auto space-y-4">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-500 bg-slate-900/50 p-3 rounded-xl border border-gray-700">
                                        <div className="flex flex-col items-center justify-center border-r border-gray-700">
                                            <div className="flex items-center gap-1 mb-1 text-gray-400"><Clock className="w-3 h-3"/> Vaxt</div>
                                            <span className={`${isEnded ? 'text-red-400' : 'text-gaming-neon'} font-mono text-sm`}>
                                                {isEnded ? "00:00:00" : timeLeft}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex items-center gap-1 mb-1 text-gray-400"><Users className="w-3 h-3"/> İştirakçı</div>
                                            <span className="text-white text-sm">{giveaway.participants.length}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {isEnded ? (
                                        <div className="bg-slate-800 text-gray-400 font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 cursor-not-allowed">
                                            <AlertCircle className="w-5 h-5" /> Bu oyun bitib
                                        </div>
                                    ) : isJoined ? (
                                        <div className="bg-green-600/20 border border-green-600 text-green-500 font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2">
                                            <CheckCircle className="w-5 h-5" /> Artıq İştirak Edirsiniz
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleJoin(giveaway.id)}
                                            className="w-full bg-gradient-to-r from-purple-600 to-gaming-accent hover:from-purple-500 hover:to-gaming-accent/80 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/40 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Gift className="w-5 h-5" /> İştirak Et (Pulsuz)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {giveaways.length === 0 && (
                <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-gray-800">
                    <p className="text-gray-500">Hazırda aktiv hədiyyəli oyun yoxdur. Tezliklə yeniləri əlavə olunacaq!</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Giveaways;