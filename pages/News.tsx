import React from 'react';
import { useApp } from '../store';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const News = () => {
  const { blogs } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gaming-dark py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Xəbərlər və Yeniliklər</h1>
            <p className="text-gray-400">Oyun dünyasından ən son məlumatlar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length === 0 ? (
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">Hələ ki, heç bir xəbər yoxdur.</p>
                </div>
            ) : (
                blogs.map(blog => (
                    <div key={blog.id} className="bg-gaming-card border border-gray-800 rounded-xl overflow-hidden hover:border-gaming-neon transition-all duration-300 group flex flex-col h-full">
                        <div className="h-48 overflow-hidden relative">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(blog.date).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{blog.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{blog.content}</p>
                            <button 
                                onClick={() => navigate(`/news/${blog.id}`)}
                                className="w-full bg-slate-800 hover:bg-gaming-neon hover:text-black text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                Ətraflı Oxu <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default News;