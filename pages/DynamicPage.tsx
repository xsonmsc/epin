
import React, { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { FileText, ArrowLeft } from 'lucide-react';

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pages } = useApp();
  const navigate = useNavigate();

  const page = pages.find(p => p.slug === slug);

  if (!page) {
    return (
        <div className="min-h-screen bg-gaming-dark flex flex-col items-center justify-center pt-24 pb-20">
            <h2 className="text-3xl font-bold text-white mb-4">404 - Səhifə Tapılmadı</h2>
            <p className="text-gray-400 mb-8">Axtardığınız səhifə mövcud deyil və ya silinib.</p>
            <button onClick={() => navigate('/')} className="btn-primary px-8 py-3 rounded-xl font-bold">Ana Səhifəyə Qayıt</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark pt-6 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl border border-white/10 mb-6 backdrop-blur-md shadow-2xl">
                    <FileText className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg capitalize">
                    {page.title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full"></div>
            </div>

            {/* Content Card */}
            <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {page.content}
                </div>
            </div>
        </div>
    </div>
  );
};

export default DynamicPage;
