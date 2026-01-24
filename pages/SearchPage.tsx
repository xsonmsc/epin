
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import { Search, ArrowLeft } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { products } = useApp();

  const filteredProducts = products.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gaming-dark pb-20 pt-28 px-4">
        <div className="max-w-7xl mx-auto">
            <button onClick={() => navigate('/')} className="flex items-center text-gray-400 hover:text-white mb-6 group transition-colors">
                <div className="bg-slate-800 p-2 rounded-full mr-2 group-hover:bg-slate-700">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Ana Səhifəyə Qayıt</span>
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Axtarış Nəticələri</h1>
                <p className="text-gray-400">"{query}" sorğusu üzrə <span className="text-primary font-bold">{filteredProducts.length}</span> məhsul tapıldı.</p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-gray-800">
                    <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-500"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Təəssüf ki, heç nə tapılmadı</h3>
                    <p className="text-gray-500">Açar sözləri dəyişərək yenidən yoxlayın.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default SearchPage;
