
import React from 'react';
import { useApp } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Send, Youtube, MessageCircle, Mail, MapPin, Phone, ChevronRight, Smartphone } from 'lucide-react';

const Footer = () => {
  const { siteSettings, categories, agreements, user } = useApp();
  const navigate = useNavigate();

  // Get top 5 categories
  const footerCategories = categories.slice(0, 5);

  return (
    <footer className="bg-[#0b1120] border-t border-white/5 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                  D
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  GAME<span className="text-primary font-light">PAY</span>
                </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {siteSettings.footerText || "Ən sərfəli qiymətə rəqəmsal məhsullar, oyun valyutaları və proqram təminatı lisenziyaları."}
            </p>
            
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    {siteSettings.whatsappNumber}
                </div>
                {siteSettings.contactEmail && (
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Mail className="w-4 h-4 text-primary" />
                        {siteSettings.contactEmail}
                    </div>
                )}
                {siteSettings.contactAddress && (
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        {siteSettings.contactAddress}
                    </div>
                )}
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                Populyar Kateqoriyalar
            </h3>
            <ul className="space-y-3">
                {footerCategories.map(cat => (
                    <li key={cat.id}>
                        <Link to={`/category/${cat.id}`} className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-gray-600" /> {cat.name}
                        </Link>
                    </li>
                ))}
            </ul>
          </div>

          {/* Column 3: Corporate & Agreements */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                Haqqımızda
            </h3>
            <ul className="space-y-3">
                <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-gray-600" /> Çözüm Mərkəzi (Əlaqə)
                    </Link>
                </li>
                {agreements.map(rule => (
                    <li key={rule.id}>
                        <Link to="/rules" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-gray-600" /> {rule.title}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link to="/rules" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 text-sm flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-gray-600" /> İstifadəçi Razılaşması
                    </Link>
                </li>
            </ul>
          </div>

          {/* Column 4: Membership & Socials */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                Üzvlük
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
                    </>
                )}
            </ul>

            <h3 className="text-white font-bold text-lg mb-4">Sosial Media</h3>
            <div className="flex gap-3">
                {siteSettings.socials?.instagram && (
                    <a href={siteSettings.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500 hover:text-white transition-all shadow-lg">
                        <Instagram className="w-5 h-5" />
                    </a>
                )}
                {siteSettings.socials?.telegram && (
                    <a href={siteSettings.socials.telegram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                        <Send className="w-5 h-5" />
                    </a>
                )}
                {siteSettings.socials?.tiktok && (
                    <a href={siteSettings.socials.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border hover:border-white/20 transition-all shadow-lg">
                        <Smartphone className="w-5 h-5" />
                    </a>
                )}
                {siteSettings.socials?.whatsapp && (
                    <a href={siteSettings.socials.whatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all shadow-lg">
                        <MessageCircle className="w-5 h-5" />
                    </a>
                )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} {siteSettings.siteName}. Bütün hüquqlar qorunur.
            </p>
            <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[8px] text-white font-bold">M10</div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
