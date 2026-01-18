import React from 'react';
import { useApp } from '../store';
import { Shield, FileText } from 'lucide-react';

const Rules = () => {
  const { agreements } = useApp();

  return (
    <div className="min-h-screen bg-gaming-dark py-12 px-4">
      <div className="max-w-4xl mx-auto">
         <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gaming-neon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gaming-neon" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Qaydalar və Şərtlər</h1>
            <p className="text-gray-400">İstifadəçi razılaşması və məxfilik siyasəti</p>
        </div>

        <div className="space-y-6">
            {agreements.length === 0 ? (
                 <div className="text-center py-10 bg-slate-900/50 rounded-xl border border-gray-800">
                    <p className="text-gray-500">Qaydalar hələ əlavə edilməyib.</p>
                </div>
            ) : (
                agreements.map(rule => (
                    <div key={rule.id} className="bg-gaming-card border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <FileText className="text-gaming-accent w-6 h-6" />
                            {rule.title}
                        </h3>
                        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
                            {rule.content}
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