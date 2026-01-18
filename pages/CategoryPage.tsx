import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, Search, Filter, SlidersHorizontal, ArrowDownUp } from 'lucide-react';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, products } = useApp();
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');

  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(p => p.categoryId === id);

  // Filter & Sort Logic
  const filteredProducts = categoryProducts
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'name-asc') return a.title.localeCompare(b.title);
        return 0; // Default order
    });

  if (!category) {
      return (
        <div className="min-h-screen bg-gaming-dark flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Kateqoriya Tapılmadı</h2>
                <button onClick={() => navigate('/')} className="text-gaming-neon hover:underline">Ana Səhifəyə Qayıt</button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gaming-dark pb-20 pt-6 px-4">
        <div className="max-w-7xl mx-auto">
            {/* Breadcrumb / Back */}
            <button onClick={() => navigate('/')} className="flex items-center text-gray-400 hover:text-white mb-6 group transition-colors">
                <div className="bg-slate-800 p-2 rounded-full mr-2 group-hover:bg-slate-700">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Ana Səhifəyə Qayıt</span>
            </button>

            {/* Modern Header Banner */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-56 md:h-72 border border-gray-800 shadow-2xl group">
                {category.image ? (
                    <img src={category.image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" alt={category.name} />
                ) : (
                    <div className="w-full h-full bg-slate-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-gaming-dark/60 to-transparent flex flex-col justify-end p-8 md:p-12">
                     <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-lg">{category.name}</h1>
                     <p className="text-gray-300 text-lg flex items-center gap-2">
                        <span className="bg-gaming-neon text-black px-2 py-0.5 rounded text-sm font-bold">{categoryProducts.length}</span> 
                        Məhsul mövcuddur
                     </p>
                </div>
            </div>

            {/* Toolbar: Search & Sort */}
            <div className="bg-gaming-card border border-gray-800 rounded-2xl p-4 mb-8 sticky top-20 z-30 shadow-xl backdrop-blur-md bg-opacity-90">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder={`${category.name} daxilində axtar...`}
                            className="w-full bg-slate-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-gaming-neon focus:ring-1 focus:ring-gaming-neon outline-none transition-all placeholder-gray-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative min-w-[200px]">
                        <div className="absolute left-3 top-3.5 pointer-events-none">
                            <ArrowDownUp className="w-5 h-5 text-gray-500" />
                        </div>
                        <select 
                            className="w-full appearance-none bg-slate-900 border border-gray-700 rounded-xl pl-10 pr-8 py-3 text-white focus:border-gaming-neon outline-none cursor-pointer"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as any)}
                        >
                            <option value="default">Sıralama: Varsayılan</option>
                            <option value="price-asc">Qiymət: Ucuzdan Bahaya</option>
                            <option value="price-desc">Qiymət: Bahadan Ucuza</option>
                            <option value="name-asc">Ad: A-Z</option>
                        </select>
                        <div className="absolute right-3 top-4 pointer-events-none">
                            <Filter className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-gray-800">
                    <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-500"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Nəticə Tapılmadı</h3>
                    <p className="text-gray-500">Axtarışınıza uyğun məhsul yoxdur.</p>
                    <button onClick={() => setSearch('')} className="mt-4 text-gaming-neon font-bold hover:underline">Axtarışı Təmizlə</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default CategoryPage;