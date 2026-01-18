import React from 'react';
import { Product, ProductType } from '../types';
import { ShoppingCart, Key, UserCheck, Heart, Star, Infinity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, toggleWishlist, isAuthenticated, comments } = useApp();
  const navigate = useNavigate();
  
  const isLiked = user?.wishlist?.includes(product.id);

  // Calculate Rating
  const productComments = comments.filter(c => c.targetId === product.id && c.isApproved && c.rating);
  const avgRating = productComments.length > 0 
      ? productComments.reduce((acc, c) => acc + (c.rating || 0), 0) / productComments.length 
      : 0;

  const getIcon = () => {
    switch (product.type) {
      case ProductType.LICENSE_KEY: return <Key className="w-3 h-3 text-white" />;
      case ProductType.ACCOUNT: return <UserCheck className="w-3 h-3 text-white" />;
      default: return <ShoppingCart className="w-3 h-3" />;
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if(!isAuthenticated) {
          navigate('/auth');
          return;
      }
      toggleWishlist(product.id);
  };

  return (
    <div className="bg-gaming-card border border-gray-800 hover:border-white transition-all duration-300 group relative flex flex-col h-full overflow-hidden">
      <div className="relative h-56 overflow-hidden shrink-0 bg-black">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
        />
        
        {/* Type Badge */}
        <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold uppercase px-3 py-1.5 flex items-center gap-2">
          {getIcon()}
          {product.type === ProductType.LICENSE_KEY ? 'Lisenziya' : 'Hesab'}
        </div>

        {/* Lifetime Badge */}
        {product.isLifetime && (
             <div className="absolute bottom-0 right-0 bg-white text-black text-[10px] font-black uppercase px-3 py-1.5 flex items-center gap-1">
                 <Infinity className="w-3 h-3" /> Ömürlük
             </div>
        )}
        
        {/* Wishlist Button */}
        <button 
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all ${isLiked ? 'text-red-500' : 'text-gray-300 hover:text-white'}`}
        >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">{product.title}</h3>
        
        {/* Rating */}
        {avgRating > 0 && (
            <div className="flex items-center gap-1 mb-3">
                 <div className="flex text-white">
                     {[1,2,3,4,5].map(star => (
                         <Star key={star} className={`w-3 h-3 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-gray-700'}`} />
                     ))}
                 </div>
                 <span className="text-xs text-gray-500">({productComments.length})</span>
            </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
          <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase">Qiymət</span>
              <span className="text-xl font-bold text-white">{product.price.toFixed(2)} ₼</span>
          </div>
          <Link 
            to={`/product/${product.id}`}
            className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Bax
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;