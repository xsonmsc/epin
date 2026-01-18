import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Product } from '../types';
import { ArrowLeft, CheckCircle, ShieldCheck, ShoppingCart, Heart, Star, MessageSquare, User, Send } from 'lucide-react';

const ProductView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, user, toggleWishlist, isAuthenticated, comments, addComment } = useApp();
  
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [userInput, setUserInput] = useState('');
  const [added, setAdded] = useState(false);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  
  // Review Form State
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) setProduct(found);
    else navigate('/');
  }, [id, products, navigate]);

  if (!product) return null;

  const isLiked = user?.wishlist?.includes(product.id);
  const finalPrice = product.price - (product.price * (product.discountPercent / 100));

  // Filter Comments for this product
  const productComments = comments.filter(c => c.targetId === product.id && c.isApproved && c.type === 'product');
  const avgRating = productComments.length > 0 
      ? productComments.reduce((acc, c) => acc + (c.rating || 0), 0) / productComments.length 
      : 0;

  const handleAddToCart = () => {
    if (product.requiresInput && !userInput) {
      alert("Zəhmət olmasa tələb olunan məlumatı daxil edin.");
      return;
    }
    addToCart(product, userInput);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  const handleWishlist = () => {
      if(!isAuthenticated) {
          navigate('/auth');
          return;
      }
      toggleWishlist(product.id);
  };

  const submitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if(!isAuthenticated) {
          alert("Rəy yazmaq üçün daxil olun.");
          navigate('/auth');
          return;
      }
      if(!reviewText.trim()) return;

      addComment({
          author: user?.name || 'Anonim',
          content: reviewText,
          type: 'product',
          targetId: product.id,
          rating: reviewRating
      });

      setReviewText('');
      setReviewRating(5);
      alert("Rəyiniz əlavə olundu!");
  };

  return (
    <div className="min-h-screen bg-gaming-dark py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Mağazaya Qayıt
        </button>

        <div className="bg-gaming-card rounded-2xl border border-gray-800 overflow-hidden shadow-2xl animate-fade-in mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image Section */}
              <div className="w-full md:w-1/3">
                  <img src={product.image} alt={product.title} className="w-full rounded-xl object-cover aspect-square shadow-lg border border-gray-700" />
              </div>

              {/* Details Section */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-wide">{product.title}</h1>
                    <button 
                        onClick={handleWishlist}
                        className={`p-3 rounded-full border transition-all ${isLiked ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-slate-800 border-gray-700 text-gray-400 hover:text-white'}`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Rating Stars Summary */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-gray-600'}`} />
                        ))}
                    </div>
                    <span className="text-sm text-gray-400">({productComments.length} rəy)</span>
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="text-gaming-neon font-black text-4xl">{finalPrice.toFixed(2)} ₼</div>
                    {product.discountPercent > 0 && (
                        <div className="flex flex-col">
                            <span className="text-gray-500 line-through text-sm">{product.price.toFixed(2)} ₼</span>
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">-{product.discountPercent}%</span>
                        </div>
                    )}
                </div>

                {product.requiresInput && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      {product.inputLabel || "Account ID / Link"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="w-full bg-slate-900 border border-gray-600 rounded-xl p-4 text-white focus:border-gaming-neon outline-none transition-all shadow-inner"
                      placeholder="Məlumatı bura daxil edin..."
                    />
                  </div>
                )}

                <div className="flex gap-4">
                    <button
                    onClick={handleAddToCart}
                    className={`flex-1 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-0.5
                        ${added ? 'bg-green-600 text-white' : 'bg-gaming-neon hover:bg-cyan-400 text-black'}`}
                    >
                    {added ? (
                        <>
                            <CheckCircle className="w-5 h-5" /> Səbətə Əlavə Edildi
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5" /> Səbətə At
                        </>
                    )}
                    </button>
                    
                    <div className="p-4 bg-slate-800 rounded-xl border border-gray-700 flex items-center justify-center text-gray-400" title="Ani Təslimat">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS: Description & Reviews */}
        <div className="bg-gaming-card border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
             <div className="flex border-b border-gray-800">
                 <button 
                    onClick={() => setActiveTab('desc')}
                    className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 
                        ${activeTab === 'desc' ? 'border-gaming-neon text-white bg-slate-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                 >
                     Məhsul Haqqında
                 </button>
                 <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 
                        ${activeTab === 'reviews' ? 'border-gaming-neon text-white bg-slate-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                 >
                     Rəylər ({productComments.length})
                 </button>
             </div>

             <div className="p-8">
                 {activeTab === 'desc' && (
                     <div className="animate-fade-in">
                         <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="bg-slate-900 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><ShieldCheck className="w-5 h-5"/></div>
                                 <div>
                                     <h4 className="font-bold text-white">Rəsmi Zəmanət</h4>
                                     <p className="text-xs text-gray-500">Bütün məhsullar yoxlanılır.</p>
                                 </div>
                             </div>
                             <div className="bg-slate-900 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><CheckCircle className="w-5 h-5"/></div>
                                 <div>
                                     <h4 className="font-bold text-white">Ani Təslimat</h4>
                                     <p className="text-xs text-gray-500">Ödənişdən dərhal sonra.</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}

                 {activeTab === 'reviews' && (
                     <div className="animate-fade-in">
                         {/* Review List */}
                         <div className="space-y-6 mb-10">
                             {productComments.length === 0 ? (
                                 <p className="text-center text-gray-500 py-4">Bu məhsul üçün hələ rəy yoxdur.</p>
                             ) : (
                                 productComments.map((comment) => (
                                     <div key={comment.id} className="bg-slate-900/50 p-4 rounded-xl border border-gray-800">
                                         <div className="flex justify-between items-start mb-2">
                                             <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 bg-gaming-accent rounded-full flex items-center justify-center font-bold text-white">
                                                     {comment.author.charAt(0)}
                                                 </div>
                                                 <div>
                                                     <p className="font-bold text-white text-sm">{comment.author}</p>
                                                     <div className="flex text-yellow-400 text-xs">
                                                        {[1,2,3,4,5].map(s => (
                                                            <Star key={s} className={`w-3 h-3 ${s <= (comment.rating || 5) ? 'fill-current' : 'text-gray-700'}`} />
                                                        ))}
                                                     </div>
                                                 </div>
                                             </div>
                                             <span className="text-xs text-gray-600">{new Date(comment.date).toLocaleDateString()}</span>
                                         </div>
                                         <p className="text-gray-300 text-sm ml-13 pl-1">{comment.content}</p>
                                     </div>
                                 ))
                             )}
                         </div>

                         {/* Add Review Form */}
                         {isAuthenticated ? (
                             <div className="bg-slate-800 p-6 rounded-xl border border-gray-700">
                                 <h3 className="font-bold text-white mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-gaming-neon"/> Rəy Yaz</h3>
                                 <form onSubmit={submitReview}>
                                     <div className="mb-4">
                                         <label className="block text-xs text-gray-400 mb-2 font-bold uppercase">Qiymətləndirmə</label>
                                         <div className="flex gap-2">
                                             {[1, 2, 3, 4, 5].map((star) => (
                                                 <button
                                                     key={star}
                                                     type="button"
                                                     onClick={() => setReviewRating(star)}
                                                     className={`transition-transform hover:scale-110 ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                 >
                                                     <Star className="w-8 h-8 fill-current" />
                                                 </button>
                                             ))}
                                         </div>
                                     </div>
                                     <div className="mb-4">
                                         <label className="block text-xs text-gray-400 mb-2 font-bold uppercase">Rəyiniz</label>
                                         <textarea
                                             className="w-full bg-slate-900 border border-gray-600 rounded-lg p-3 text-white focus:border-gaming-neon outline-none h-24 resize-none"
                                             placeholder="Məhsul haqqında fikirlərinizi bölüşün..."
                                             value={reviewText}
                                             onChange={(e) => setReviewText(e.target.value)}
                                         ></textarea>
                                     </div>
                                     <button type="submit" className="bg-gaming-neon hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors">
                                         <Send className="w-4 h-4" /> Göndər
                                     </button>
                                 </form>
                             </div>
                         ) : (
                             <div className="bg-slate-800/50 p-6 rounded-xl border border-gray-700 text-center">
                                 <p className="text-gray-400 mb-4">Rəy yazmaq üçün hesabınıza daxil olmalısınız.</p>
                                 <button onClick={() => navigate('/auth')} className="text-gaming-neon hover:underline font-bold">Giriş Et</button>
                             </div>
                         )}
                     </div>
                 )}
             </div>
        </div>

      </div>
    </div>
  );
};

export default ProductView;