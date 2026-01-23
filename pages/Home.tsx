
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import { Search, ChevronRight, Zap, ArrowRight, Gamepad2, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { products, categories, blogs } = useApp();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock Slider Data
  const slides = [
    {
      id: 1,
      image: "https://wallpapers.com/images/hd/pubg-mobile-poster-j688p340057041a7.jpg",
      title: "PUBG MOBILE",
      subtitle: "UC FİRTINASI BAŞLADI",
      desc: "Ən sərfəli qiymətə UC yüklə, mövsümün kralı ol!",
      btnText: "İndi Al",
      link: "/category/cat_pubg"
    },
    {
      id: 2,
      image: "https://images.hdqwalls.com/wallpapers/valorant-4k-gaming-new-2020-ix.jpg",
      title: "VALORANT",
      subtitle: "YENİ AJAN GƏLDİ",
      desc: "VP alaraq yeni skinlər və battle pass əldə et.",
      btnText: "VP Satın Al",
      link: "/category/cat_valorant"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Specific Filtered Products
  const pubgProducts = products.filter(p => p.categoryId === 'cat_pubg').slice(0, 4);
  const valorantProducts = products.filter(p => p.categoryId === 'cat_valorant').slice(0, 4);

  return (
    <div className="min-h-screen pb-20 pt-20">
      
      {/* 1. BRAND STRIP (Categories) */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
             {categories.map((cat) => (
                 <div 
                    key={cat.id} 
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]"
                 >
                     <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-gray-700 to-gray-900 group-hover:from-primary group-hover:to-secondary transition-all">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-background">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                     </div>
                     <span className="text-xs text-gray-400 group-hover:text-white font-medium text-center truncate w-full">{cat.name}</span>
                 </div>
             ))}
         </div>
      </div>

      {/* 2. HERO SECTION (Slider + Side Banners) */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
         {/* Main Slider */}
         <div className="lg:col-span-2 relative h-[250px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
             {slides.map((slide, index) => (
                 <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                 >
                     <img src={slide.image} alt="" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-12">
                         <span className="text-primary font-bold tracking-widest text-sm md:text-base mb-2 animate-fade-in">{slide.title}</span>
                         <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase mb-2 md:mb-4 leading-none max-w-lg animate-slide-up">{slide.subtitle}</h2>
                         <p className="text-gray-300 text-sm md:text-lg mb-6 max-w-md hidden sm:block animate-slide-up animation-delay-500">{slide.desc}</p>
                         <button 
                            onClick={() => navigate(slide.link)}
                            className="w-fit bg-primary hover:bg-primary-dark text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg transform skew-x-[-10deg] transition-all hover:scale-105 animate-slide-up animation-delay-700"
                         >
                             <span className="skew-x-[10deg] inline-block">{slide.btnText}</span>
                         </button>
                     </div>
                 </div>
             ))}
             
             {/* Slider Indicators */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                 {slides.map((_, idx) => (
                     <button 
                        key={idx} 
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-primary' : 'w-2 bg-white/50 hover:bg-white'}`}
                     />
                 ))}
             </div>
         </div>

         {/* Side Banners (Static) */}
         <div className="hidden lg:flex flex-col gap-6 h-[400px]">
             <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => navigate('/category/cat_valorant')}>
                 <img src="https://images.hdqwalls.com/wallpapers/valorant-jett-4k-game-2s.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="VP" />
                 <div className="absolute inset-0 bg-black/50 hover:bg-black/30 transition-colors flex flex-col justify-end p-6">
                     <h3 className="text-white font-bold text-xl uppercase italic">Ən Uyğun <br/><span className="text-primary">Qiymətə VP</span></h3>
                     <span className="text-xs text-gray-300 mt-1 flex items-center gap-1">İndi Al <ArrowRight className="w-3 h-3"/></span>
                 </div>
             </div>
             <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => navigate('/category/cat_pubg')}>
                 <img src="https://w0.peakpx.com/wallpaper/419/50/HD-wallpaper-pubg-suit-guy-playerunknowns-battlegrounds-pubg.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="UC" />
                 <div className="absolute inset-0 bg-black/50 hover:bg-black/30 transition-colors flex flex-col justify-end p-6">
                     <h3 className="text-white font-bold text-xl uppercase italic">Endirimli <br/><span className="text-yellow-400">UC Paketləri</span></h3>
                     <span className="text-xs text-gray-300 mt-1 flex items-center gap-1">İndi Al <ArrowRight className="w-3 h-3"/></span>
                 </div>
             </div>
         </div>
      </div>

      {/* 3. PUBG SECTION (Specific Grid) */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                  <div className="w-1 bg-yellow-400 h-6 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white uppercase italic tracking-wider">PUBG ID Yükləmə</h2>
              </div>
              <button 
                onClick={() => navigate('/category/cat_pubg')}
                className="bg-yellow-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-300 transition-colors"
              >
                  TÜMÜ
              </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pubgProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
              ))}
          </div>
      </div>

      {/* 4. POPULAR CATEGORIES (Vertical Cards) */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="flex items-center gap-3 mb-6">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white uppercase italic tracking-wider">OYUN DÜNYASI</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                  categories.find(c => c.id === 'cat_pubg'),
                  categories.find(c => c.id === 'cat_valorant'),
                  categories.find(c => c.id === 'cat_mlbb'),
                  categories.find(c => c.id === 'cat_wolfteam')
              ].filter(Boolean).map((cat) => (
                  <div 
                    key={cat!.id}
                    onClick={() => navigate(`/category/${cat!.id}`)}
                    className="relative h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
                  >
                      <img src={cat!.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat!.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full text-center">
                          <h3 className="text-white font-black text-xl md:text-2xl uppercase italic drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">{cat!.name}</h3>
                          <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* 5. NEWS / BLOG SECTION */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                  <div className="w-1 bg-purple-500 h-6 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white uppercase italic tracking-wider">Xəbərlər & Yeniliklər</h2>
              </div>
              <button 
                onClick={() => navigate('/news')}
                className="bg-purple-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-600 transition-colors"
              >
                  TÜMÜ
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {blogs.slice(0, 3).map(blog => (
                   <div key={blog.id} className="bg-gaming-card border border-gray-800 rounded-xl overflow-hidden group hover:border-purple-500/50 transition-colors">
                       <div className="h-40 overflow-hidden relative">
                           <img src={blog.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={blog.title} />
                           <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-bold border border-white/10">
                               XƏBƏR
                           </div>
                       </div>
                       <div className="p-4">
                           <p className="text-xs text-gray-400 mb-2">{new Date(blog.date).toLocaleDateString()}</p>
                           <h3 className="text-white font-bold text-sm line-clamp-2 hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/news/${blog.id}`)}>{blog.title}</h3>
                       </div>
                   </div>
               ))}
          </div>
      </div>

    </div>
  );
};

export default Home;
