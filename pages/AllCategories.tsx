
import React, { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowDownUp, Filter } from 'lucide-react';

const AllCategories = () => {
  const { categories } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'az' | 'za'>('default');

  const filteredCategories = categories
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
        if (sort === 'az') return a.name.localeCompare(b.name);
        if (sort === 'za') return b.name.localeCompare(a.name);
        return 0;
    });

  return (
    <div className="min-h-screen bg-gaming-dark pt-6 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
                    Bütün <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Kateqoriyalar</span>
                </h1>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Axtar..." 
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <ArrowDownUp className="absolute left-3 top-3.5 text-gray-500 w-4 h-4 pointer-events-none" />
                        <select 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-white focus:border-primary outline-none appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as any)}
                        >
                            <option value="default">Sıralama</option>
                            <option value="az">A-Z</option>
                            <option value="za">Z-A</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCategories.map(cat => (
                    <div 
                        key={cat.id} 
                        onClick={() => navigate(`/category/${cat.id}`)}
                        className="group relative h-48 md:h-56 bg-surface border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] hover:-translate-y-2"
                    >
                        {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-gray-600">No Image</div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                            <h3 className="text-white font-bold text-lg md:text-xl uppercase italic drop-shadow-lg group-hover:text-primary transition-colors">{cat.name}</h3>
                            <div className="h-1 w-0 bg-primary mx-auto mt-2 rounded-full group-hover:w-12 transition-all duration-300"></div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">Kateqoriya tapılmadı.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AllCategories;
