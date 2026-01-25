
import React from 'react';
import { useApp } from '../store';
import { Shield, FileText, AlertCircle } from 'lucide-react';

const Rules = () => {
  const { agreements } = useApp();

  return (
    <div className="min-h-screen bg-gaming-dark pt-6 pb-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
         <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl border border-white/10 mb-6 backdrop-blur-md shadow-2xl">
                <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
                Qaydalar və <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Şərtlər</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Platformamızdan istifadə edərkən hüquqlarınızı və öhdəliklərinizi bilməyiniz vacibdir.
            </p>
        </div>

        <div className="space-y-12">
            {agreements.length === 0 ? (
                 <div className="text-center py-20 bg-surface rounded-3xl border border-white/5 border-dashed">
                    <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Hələ ki, əlavə edilmiş qayda yoxdur.</p>
                </div>
            ) : (
                agreements.map((rule, idx) => (
                    <div key={rule.id} className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                        <div className="flex items-start gap-6">
                            <div className="hidden md:flex flex-col items-center gap-2 mt-1">
                                <div className="w-12 h-12 rounded-2xl bg-surfaceHighlight border border-white/10 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors shadow-lg">
                                    {idx + 1}
                                </div>
                                <div className="w-0.5 h-full bg-white/5 group-hover:bg-primary/20 transition-colors min-h-[50px] rounded-full"></div>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 pb-4 border-b border-white/5">
                                    <FileText className="text-primary w-6 h-6 md:hidden" />
                                    {rule.title}
                                </h3>
                                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed text-base md:text-lg">
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
