
import React from 'react';
import { useApp } from '../store';
import { Shield, FileText, ChevronRight, AlertCircle } from 'lucide-react';

const Rules = () => {
  const { agreements } = useApp();

  return (
    <div className="min-h-screen bg-gaming-dark pt-28 pb-12 px-4 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
         <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30 transform rotate-3">
                <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter drop-shadow-lg">
                Qaydalar və <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Şərtlər</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Platformamızdan istifadə edərkən aşağıdakı qaydalarla tanış olmağınız vacibdir.
            </p>
        </div>

        <div className="space-y-8">
            {agreements.length === 0 ? (
                 <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-gray-800 border-dashed">
                    <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Hələ ki, əlavə edilmiş qayda yoxdur.</p>
                </div>
            ) : (
                agreements.map((rule, idx) => (
                    <div key={rule.id} className="glass-card rounded-3xl p-8 md:p-10 border border-white/5 hover:border-primary/20 transition-all duration-300 group">
                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex flex-col items-center gap-2 mt-2">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                    {idx + 1}
                                </div>
                                <div className="w-0.5 h-full bg-white/5 group-hover:bg-primary/20 transition-colors min-h-[50px]"></div>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FileText className="text-primary w-6 h-6" />
                                    {rule.title}
                                </h3>
                                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed text-base md:text-lg bg-black/20 p-6 rounded-2xl border border-white/5">
                                    {rule.content}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Rules;
