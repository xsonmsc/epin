
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, Search, Filter, ArrowDownUp, Layers, ChevronRight, Grid } from 'lucide-react';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, products } = useApp();
  
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');
  
  // Step State: If string is set, we show products for that sub-category. If null, we show sub-category list.
  const [selectedSubCat, setSelectedSubCat] = useState<string | null>(null);

  const category = categories.find(c => c.id === id);
  
  // Logic: Does this category have sub-categories defined?
  // We use the predefined subCategories from the category object.
  const subCategories = category?.subCategories || [];
  const hasSubCategories = subCategories.length > 0;

  // Determine which View to show
  // Step 2 View: Show Sub-Category Cards IF category has subs AND none is selected yet.
  // Step 3 View: Show Products IF category has NO subs OR one is selected.
  const showSubCategorySelection = hasSubCategories && selectedSubCat === null;

  // Filter Products based on current state
  const categoryProducts = products.filter(p => {
      // Must match main category
      if (p.categoryId !== id) return false;
      
      // If we are in "Show Products" mode and there are sub-categories, filter by selected
      if (!showSubCategorySelection && hasSubCategories && selectedSubCat) {
          return p.subCategory === selectedSubCat;
      }
      
      return true;
  });

  // Apply Search & Sort
  const filteredProducts = categoryProducts
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'name-asc') return a.title.localeCompare(b.title);
        return 0; 
    });

  // Handle Back Navigation (Hierarchy)
  const handleBack = () => {
      if (!showSubCategorySelection && hasSubCategories && selectedSubCat) {
          // If viewing products of a sub-category, go back to sub-category selection
          setSelectedSubCat(null);
          setSearch(''); 
      } else {
          // If at selection screen or root category, go home
          navigate('/');
      }
  };

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
            
            {/* 1. Header Navigation Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <button onClick={handleBack} className="flex items-center text-gray-400 hover:text-white group transition-colors w-fit">
                    <div className="bg-slate-800 p-2 rounded-full mr-2 group-hover:bg-slate-700 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Geri Qayıt</span>
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                            {showSubCategorySelection ? 'Ana Səhifə' : (hasSubCategories ? 'Növ Seçimi' : 'Ana Səhifə')}
                        </span>
                    </div>
                </button>

                {/* Breadcrumbs / Title */}
                <div className="flex items-center gap-2 text-sm md:text-lg font-bold text-gray-500">
                    <span className={showSubCategorySelection ? "text-white" : ""}>{category.name}</span>
                    {selectedSubCat && (
                        <>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gaming-neon">{selectedSubCat}</span>
                        </>
                    )}
                </div>
            </div>

            {/* STEP 2: SUB-CATEGORY SELECTION VIEW */}
            {showSubCategorySelection && (
                <div className="animate-fade-in">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                            Xidmət <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Növünü Seçin</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Davam etmək üçün aşağıdakı seçimlərdən birinə klikləyin.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {subCategories.map((sub, index) => (
                            <div 
                                key={index}
                                onClick={() => setSelectedSubCat(sub)}
                                className="group relative h-48 md:h-64 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-gaming-neon transition-all duration-300 shadow-2xl"
                            >
                                {/* Background Image with Blur */}
                                <div className="absolute inset-0">
                                    <img 
                                        src={category.image} 
                                        alt={sub} 
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 filter blur-sm group-hover:blur-0" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-8">
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-gaming-neon text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Seçim {index + 1}</span>
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic leading-none mb-2 group-hover:text-primary transition-colors">
                                            {sub}
                                        </h2>
                                        <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                            Məhsullara bax <ChevronRight className="w-4 h-4"/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3: PRODUCTS VIEW */}
            {!showSubCategorySelection && (
                <div className="animate-fade-in">
                    
                    {/* Header Banner (Compact) */}
                    <div className="relative rounded-2xl overflow-hidden mb-8 h-40 border border-gray-800 shadow-lg group">
                        {category.image && (
                            <img src={category.image} className="w-full h-full object-cover opacity-40" alt={category.name} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent flex items-center p-8">
                             <div>
                                 <h1 className="text-2xl md:text-4xl font-black text-white uppercase italic mb-1">
                                     {selectedSubCat || category.name}
                                 </h1>
                                 <p className="text-gray-400 text-sm">
                                    <span className="text-gaming-neon font-bold">{filteredProducts.length}</span> məhsul tapıldı
                                 </p>
                             </div>
                        </div>
                    </div>

                    {/* Toolbar: Search & Sort */}
                    <div className="bg-gaming-card border border-gray-800 rounded-2xl p-4 mb-8 sticky top-24 z-30 shadow-xl backdrop-blur-md bg-opacity-90">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                                <input 
                                    type="text" 
                                    placeholder="Məhsul axtar..."
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
                            <p className="text-gray-500">Bu kateqoriyada hələ məhsul yoxdur və ya axtarışa uyğun gəlmir.</p>
                            <button onClick={() => setSearch('')} className="mt-4 text-gaming-neon font-bold hover:underline">Axtarışı Təmizlə</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default CategoryPage;
