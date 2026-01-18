import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import { Search, ChevronRight, Zap, ShieldCheck, Truck, Percent, ChevronLeft, Layout } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop', // Cyber/Tech abstract
        title: 'GƏLƏCƏYİ KƏŞF ET',
        subtitle: 'Ən son AI alətləri və rəqəmsal həllər.'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop', // Clean office/design
        title: 'PREMIUM LİSENZİYALAR',
        subtitle: 'Windows, Office və dizayn proqramları üçün rəsmi açarlar.'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074&auto=format&fit=crop', // Creative/Netflix/Canva vibe
        title: 'YARADICILIQ VƏ ƏYLƏNCƏ',
        subtitle: 'Canva Pro, Netflix, Spotify və daha çoxu.'
    }
];

const Home = () => {
  const { products, categories } = useApp();
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Hash Scroll
  useEffect(() => {
      if (location.hash === '#categories') {
          const el = document.getElementById('categories');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
  }, [location]);

  // Auto-play Slideshow
  useEffect(() => {
      const timer = setInterval(() => {
          setCurrentSlide(prev => (prev + 1) % SLIDES.length);
      }, 5000);
      return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);

  // "Popular" filter logic for the home page list
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCat === 'All' || p.categoryId === activeCat;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (catId: string) => {
      navigate(`/category/${catId}`);
  };

  return (
    <div className="min-h-screen bg-gaming-dark pb-20">
      
      {/* 1. DYNAMIC SLIDESHOW (Hero) */}
      <div className="relative w-full h-[500px] overflow-hidden group">
         {SLIDES.map((slide, index) => (
             <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
             >
                 <img src={slide.image} className="w-full h-full object-cover grayscale" alt={slide.title} />
                 {/* Heavy overlay for B&W contrast */}
                 <div className="absolute inset-0 bg-black/60" />
                 
                 <div className={`absolute bottom-0 left-0 w-full p-8 md:p-24 flex flex-col items-center justify-center text-center transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                     <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tighter uppercase">
                         {slide.title}
                     </h1>
                     <p className="text-gray-300 text-lg md:text-2xl max-w-2xl px-4 py-2 border-l-2 border-white pl-4">
                         {slide.subtitle}
                     </p>
                 </div>
             </div>
         ))}
         
         {/* Slider Controls */}
         <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">
             <ChevronLeft className="w-6 h-6" />
         </button>
         <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">
             <ChevronRight className="w-6 h-6" />
         </button>

         {/* Indicators */}
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
             {SLIDES.map((_, idx) => (
                 <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1 transition-all duration-300 ${idx === currentSlide ? 'w-10 bg-white' : 'w-4 bg-gray-600'}`} 
                 />
             ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* 2. SEARCH BAR (Integrated) */}
        <div className="bg-gaming-card border border-gray-800 rounded-none p-1 shadow-2xl flex items-center max-w-2xl mx-auto mb-16 ring-1 ring-white/5">
            <Search className="ml-4 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Axtarış..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none text-white px-4 py-4 focus:ring-0 outline-none text-base placeholder-gray-600 font-medium"
            />
            <button className="bg-white text-black font-bold px-8 py-4 hover:bg-gray-200 transition-colors uppercase text-sm tracking-widest">
                Axtar
            </button>
        </div>

        {/* 3. CATEGORIES */}
        <div className="mb-20" id="categories">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Kateqoriyalar</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                    <div 
                        key={cat.id} 
                        onClick={() => handleCategoryClick(cat.id)}
                        className="relative h-48 bg-gaming-card border border-gray-800 cursor-pointer group hover:border-white transition-all duration-300 overflow-hidden"
                    >
                        {cat.image ? (
                            <img src={cat.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-50 group-hover:opacity-80" alt={cat.name} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Layout className="w-12 h-12 text-gray-600" />
                            </div>
                        )}
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest bg-black/80 px-4 py-2 backdrop-blur-sm border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                                {cat.name}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 4. POPULAR PRODUCTS (Tabs) */}
        <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-800 pb-4">
                <h2 className="text-2xl font-bold text-white">Populyar Məhsullar</h2>
                
                {/* Category Tabs */}
                <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveCat('All')}
                        className={`px-4 py-2 text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider
                            ${activeCat === 'All' ? 'bg-white text-black' : 'bg-transparent text-gray-400 hover:text-white border border-gray-800'}`}
                    >
                        Hamısı
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCat(cat.id)}
                            className={`px-4 py-2 text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider
                                ${activeCat === cat.id ? 'bg-white text-black' : 'bg-transparent text-gray-400 hover:text-white border border-gray-800'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-gaming-card border border-gray-800">
                    <p className="text-gray-500 text-xl">Məhsul tapılmadı.</p>
                </div>
            )}
        </div>

        {/* 5. INFO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-gray-800 border border-gray-800">
            {[
                { icon: Zap, title: "Ani Təslimat", desc: "Ödənişdən dərhal sonra" },
                { icon: ShieldCheck, title: "Rəsmi Zəmanət", desc: "Tam təhlükəsizlik" },
                { icon: Truck, title: "7/24 Dəstək", desc: "Canlı operator xidməti" },
                { icon: Percent, title: "Sərfəli Qiymət", desc: "Bazarın ən yaxşı təklifi" }
            ].map((item, idx) => (
                <div key={idx} className="bg-black p-8 text-center hover:bg-gaming-card transition-colors group">
                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wider">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default Home;