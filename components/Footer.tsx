
import React from 'react';
import { useApp } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Send, Youtube, MessageCircle, Mail, MapPin, Phone, ChevronRight, Smartphone } from 'lucide-react';

const Footer = () => {
  const { siteSettings, categories, agreements, user } = useApp();
  const navigate = useNavigate();

  // Get top 5 popular categories
  const popularCategories = categories.filter(c => c.isPopular).slice(0, 5);

  return (
    <footer className="bg-[#0b0d12] border-t border-white/5 pt-20 pb-10 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Popular Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_#8B5CF6]"></span>
                Populyar Kateqoriyalar
            </h3>
            <ul className="space-y-3">
                {popularCategories.map(cat => (
                    <li key={cat.id}>
                        <Link to={`/category/${cat.id}`} className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group">
                            <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-primary transition-colors" /> {cat.name}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link to="/#categories" className="text-primary hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 font-bold mt-2">
                        <ChevronRight className="w-3 h-3" /> Bütün Kateqoriyalar
                    </Link>
                </li>
            </ul>
          </div>

          {/* Column 2: About Us */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-secondary rounded-full shadow-[0_0_10px_#6366F1]"></span>
                Haqqımızda
            </h3>
            <ul className="space-y-3">
                <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group">
                        <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-secondary transition-colors" /> Haqqımızda
                    </Link>
                </li>
                <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group">
                        <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-secondary transition-colors" /> Çözüm Mərkəzi (Əlaqə)
                    </Link>
                </li>
                <li>
                    <Link to="/news" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group">
                        <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-secondary transition-colors" /> Xəbərlər & Yeniliklər
                    </Link>
                </li>
            </ul>
          </div>

          {/* Column 3: Agreements */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_#EC4899]"></span>
                Sözləşmələr
            </h3>
            <ul className="space-y-3">
                <li>
                    <Link to="/rules" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group">
                        <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-accent transition-colors" /> Gizlilik Siyasəti
                    </Link>
                </li>
                {agreements.slice(0, 3).map(rule => (
                    <li key={rule.id}>
                        <Link to="/rules" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group">
                            <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-accent transition-colors" /> {rule.title}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link to="/rules" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group">
                        <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-accent transition-colors" /> İptal & İade Koşulları
                    </Link>
                </li>
            </ul>
          </div>

          {/* Column 4: Membership & Socials */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-white rounded-full"></span>
                Üzvlük & Sosial
            </h3>
            <ul className="space-y-3 mb-8">
                {!user ? (
                    <>
                        <li><Link to="/auth" className="text-gray-400 hover:text-white transition-colors text-sm">Giriş Yap</Link></li>
                        <li><Link to="/auth" className="text-gray-400 hover:text-white transition-colors text-sm">Qeydiyyat</Link></li>
                        <li><button onClick={() => navigate('/auth')} className="text-gray-400 hover:text-white transition-colors text-sm text-left">Şifrəmi Unuttum</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors text-sm">Hesabım</Link></li>
                        <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors text-sm">Siparişlerim</Link></li>
                        <li><Link to="/balance" className="text-gray-400 hover:text-white transition-colors text-sm">Cüzdanım</Link></li>
                        <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors text-sm">Destek Taleplerim</Link></li>
                    </>
                )}
            </ul>

            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Bizi İzləyin</h3>
            <div className="flex gap-3">
                {siteSettings.socials?.instagram && (
                    <a href={siteSettings.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all shadow-lg group">
                        <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                )}
                {siteSettings.socials?.telegram && (
                    <a href={siteSettings.socials.telegram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all shadow-lg group">
                        <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                )}
                {siteSettings.socials?.tiktok && (
                    <a href={siteSettings.socials.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-white/20 transition-all shadow-lg group">
                        <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                )}
                {siteSettings.socials?.whatsapp && (
                    <a href={siteSettings.socials.whatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white hover:border-transparent transition-all shadow-lg group">
                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">D</div>
                <span className="font-bold text-lg">{siteSettings.siteName}</span>
            </div>
            
            <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} Bütün hüquqlar qorunur.
            </p>
            
            <div className="flex items-center gap-2 opacity-70 grayscale hover:grayscale-0 transition-all">
                <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center text-[10px] text-white font-bold">VISA</div>
                <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center text-[10px] text-white font-bold">MC</div>
                <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center text-[10px] text-white font-bold">M10</div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
