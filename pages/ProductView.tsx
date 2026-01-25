
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Product } from '../types';
import { ArrowLeft, CheckCircle, ShieldCheck, ShoppingCart, Heart, Star, MessageSquare, Send, Zap } from 'lucide-react';

const ProductView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, user, toggleWishlist, isAuthenticated, comments, addComment } = useApp();
  
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [userInput, setUserInput] = useState('');
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
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
    <div className="min-h-screen pt-6 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center text-gray-400 hover:text-white mb-8 group transition-colors">
            <div className="bg-white/5 p-2 rounded-full mr-2 group-hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
            </div>
            Mağazaya Qayıt
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            
            {/* Image Side */}
            <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden glass border border-white/10 relative z-10">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                </div>
                {/* Back glow */}
                <div className="absolute top-10 -left-10 w-full h-full bg-primary/20 blur-[100px] rounded-full z-0"></div>
            </div>

            {/* Info Side */}
            <div className="flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-4xl font-bold text-white leading-tight">{product.title}</h1>
                    <button 
                        onClick={handleWishlist}
                        className={`p-3 rounded-full border transition-all ${isLiked ? 'bg-red-500 text-white border-red-500' : 'glass border-white/10 text-gray-400 hover:text-white'}`}
                    >
                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex text-amber-400">
                        {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-gray-700'}`} />
                        ))}
                    </div>
                    <span className="text-sm text-gray-400">({productComments.length} rəy)</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="text-sm text-primary font-medium flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Rəsmi Zəmanət</span>
                </div>

                <div className="flex items-end gap-4 mb-8 p-6 glass rounded-2xl border-l-4 border-primary">
                    <div className="flex flex-col">
                         <span className="text-sm text-gray-400 mb-1">Qiymət</span>
                         <div className="text-4xl font-bold text-white">{finalPrice.toFixed(2)} <span className="text-primary text-xl">₼</span></div>
                    </div>
                    {product.discountPercent > 0 && (
                        <div className="mb-2">
                             <span className="text-lg text-gray-500 line-through mr-2">{product.price.toFixed(2)} ₼</span>
                             <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-bold">-{product.discountPercent}%</span>
                        </div>
                    )}
                </div>

                {product.requiresInput && (
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-300 mb-2 pl-1">
                      {product.inputLabel || "Account ID / Link"} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Məlumatı daxil edin..."
                    />
                  </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-2px]
                            ${added ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                    >
                        {added ? (
                            <>
                                <CheckCircle className="w-5 h-5" /> Əlavə olundu
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" /> Səbətə At
                            </>
                        )}
                    </button>
                    
                    <button className="p-4 glass rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <MessageSquare className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>

        {/* Tabs & Content */}
        <div className="glass rounded-3xl p-1 overflow-hidden">
            <div className="flex border-b border-white/5 bg-black/20">
                 <button 
                    onClick={() => setActiveTab('desc')}
                    className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-colors 
                        ${activeTab === 'desc' ? 'text-white border-b-2 border-primary bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                 >
                     Məhsul Haqqında
                 </button>
                 <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-colors 
                        ${activeTab === 'reviews' ? 'text-white border-b-2 border-primary bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                 >
                     Rəylər ({productComments.length})
                 </button>
            </div>

            <div className="p-8 md:p-12">
                 {activeTab === 'desc' && (
                     <div className="animate-fade-in text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                         {product.description}
                     </div>
                 )}

                 {activeTab === 'reviews' && (
                     <div className="animate-fade-in space-y-8">
                         {productComments.length === 0 ? (
                             <div className="text-center py-10 bg-white/5 rounded-2xl">
                                 <p className="text-gray-500">Bu məhsul üçün hələ rəy yoxdur.</p>
                             </div>
                         ) : (
                             productComments.map((comment) => (
                                 <div key={comment.id} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                     <div className="flex justify-between items-start mb-3">
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center font-bold text-white shadow-lg">
                                                 {comment.author.charAt(0)}
                                             </div>
                                             <div>
                                                 <p className="font-bold text-white">{comment.author}</p>
                                                 <div className="flex text-amber-400 text-xs mt-0.5">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= (comment.rating || 5) ? 'fill-current' : 'text-gray-700'}`} />
                                                    ))}
                                                 </div>
                                             </div>
                                         </div>
                                         <span className="text-xs text-gray-600">{new Date(comment.date).toLocaleDateString()}</span>
                                     </div>
                                     <p className="text-gray-300 pl-13 ml-13">{comment.content}</p>
                                 </div>
                             ))
                         )}

                         {isAuthenticated && (
                             <form onSubmit={submitReview} className="mt-8 pt-8 border-t border-white/5">
                                 <h3 className="font-bold text-white mb-4">Rəy Yazın</h3>
                                 <textarea
                                     className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none h-32 resize-none mb-4"
                                     placeholder="Fikirləriniz..."
                                     value={reviewText}
                                     onChange={(e) => setReviewText(e.target.value)}
                                 ></textarea>
                                 <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-8 rounded-xl transition-colors">
                                     Göndər
                                 </button>
                             </form>
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
