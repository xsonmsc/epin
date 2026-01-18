import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { ArrowLeft, Calendar, Tag, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const BlogView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogs, products } = useApp();

  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return (
        <div className="min-h-screen bg-gaming-dark flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Xəbər Tapılmadı</h2>
                <button onClick={() => navigate('/news')} className="text-gaming-neon hover:underline">Xəbərlərə Qayıt</button>
            </div>
        </div>
    );
  }

  // LOGICAL ADDITION: Smart Related Products
  // Find products that match keywords in the blog title (e.g. if Blog title has "PUBG", show PUBG products)
  const relatedProducts = products.filter(p => 
      blog.title.toLowerCase().includes(p.title.split(' ')[0].toLowerCase()) || // Match first word of product title
      blog.content.toLowerCase().includes(p.title.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-gaming-dark py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/news')} className="flex items-center text-gray-400 hover:text-white mb-6 group transition-colors">
            <div className="bg-slate-800 p-2 rounded-full mr-2 group-hover:bg-slate-700">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Bütün Xəbərlər</span>
        </button>

        <div className="bg-gaming-card border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="h-64 md:h-96 relative">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gaming-card to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                     <span className="bg-gaming-neon text-black text-xs font-bold px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Xəbərlər
                     </span>
                     <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">{blog.title}</h1>
                     <div className="flex items-center text-gray-300 text-sm gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.date).toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                     </div>
                </div>
            </div>
            
            <div className="p-8 md:p-12">
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {blog.content}
                </div>
            </div>
        </div>

        {/* LOGICAL FEATURE: Related Products Section */}
        {relatedProducts.length > 0 && (
            <div className="mt-16 animate-fade-in delay-100">
                <div className="flex items-center gap-3 mb-6">
                    <ShoppingBag className="w-6 h-6 text-gaming-accent" />
                    <h2 className="text-2xl font-bold text-white">Bu xəbərlə əlaqəli məhsullar</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {relatedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default BlogView;