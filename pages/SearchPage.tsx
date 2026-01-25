
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Search, ArrowLeft, ShoppingCart, ArrowRight } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { products, categories, addToCart } = useApp();

  const filteredProducts = products.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gaming-dark px-4">
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
                <div className="space-y-4">
                    {filteredProducts.map(product => {
                        const cat = categories.find(c => c.id === product.categoryId);
                        const finalPrice = product.price - (product.price * (product.discountPercent / 100));
                        
                        return (
                            <div key={product.id} className="bg-gaming-card border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-primary/30 transition-all group">
                                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden relative">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    {product.discountPercent > 0 && (
                                        <span className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg">
                                            -{product.discountPercent}%
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-white text-lg line-clamp-1">{product.title}</h3>
                                            <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded ml-2 whitespace-nowrap hidden sm:block">{cat?.name}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                                    </div>
                                    
                                    <div className="flex items-end justify-between mt-2">
                                        <div>
                                            {product.discountPercent > 0 && <p className="text-xs text-gray-500 line-through">{product.price.toFixed(2)} ₼</p>}
                                            <p className="text-xl font-bold text-primary">{finalPrice.toFixed(2)} ₼</p>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => navigate(`/product/${product.id}`)}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors"
                                            >
                                                Ətraflı
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if(product.requiresInput) navigate(`/product/${product.id}`);
                                                    else { addToCart(product); alert('Səbətə atıldı'); }
                                                }}
                                                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                                            >
                                                {product.requiresInput ? 'Məlumat Yaz' : 'Birbaşa Al'} <ArrowRight className="w-3 h-3"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
