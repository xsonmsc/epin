import React from 'react';
import { useApp } from '../store';
import { Mail, MapPin, Phone, Instagram, Send, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const { siteSettings } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gaming-dark py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Bizimlə Əlaqə</h1>
            <p className="text-gray-400">Suallarınız var? Bizə yazın və ya zəng edin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gaming-card border border-gray-800 rounded-3xl p-8 shadow-2xl animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-6">Əlaqə Vasitələri</h3>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gaming-neon/10 rounded-full flex items-center justify-center text-gaming-neon">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Whatsapp & Mobil</p>
                            <a href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-white font-bold text-lg hover:text-green-400 transition-colors">
                                {siteSettings.whatsappNumber}
                            </a>
                        </div>
                    </div>

                    {siteSettings.contactEmail && (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Elektron Poçt</p>
                                <a href={`mailto:${siteSettings.contactEmail}`} className="text-white font-bold text-lg hover:text-blue-300 transition-colors">
                                    {siteSettings.contactEmail}
                                </a>
                            </div>
                        </div>
                    )}

                    {siteSettings.contactAddress && (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ünvan</p>
                                <p className="text-white font-bold text-lg">{siteSettings.contactAddress}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                    <h4 className="font-bold text-white mb-4">Sosial Media</h4>
                    <div className="flex gap-4">
                        {siteSettings.socials?.instagram && (
                            <a href={siteSettings.socials.instagram} target="_blank" rel="noreferrer" className="bg-slate-800 p-3 rounded-lg text-gray-400 hover:text-pink-500 hover:bg-slate-700 transition-colors"><Instagram className="w-6 h-6"/></a>
                        )}
                        {siteSettings.socials?.telegram && (
                            <a href={siteSettings.socials.telegram} target="_blank" rel="noreferrer" className="bg-slate-800 p-3 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-slate-700 transition-colors"><Send className="w-6 h-6"/></a>
                        )}
                        {siteSettings.socials?.whatsapp && (
                            <a href={siteSettings.socials.whatsapp} target="_blank" rel="noreferrer" className="bg-slate-800 p-3 rounded-lg text-gray-400 hover:text-green-500 hover:bg-slate-700 transition-colors"><MessageCircle className="w-6 h-6"/></a>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-gray-800 rounded-3xl p-8 flex flex-col justify-center text-center animate-fade-in delay-100">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
                    <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Canlı Dəstək</h3>
                <p className="text-gray-400 mb-6">Müştəri xidmətlərimiz 7/24 fəaliyyət göstərir. Sualınızı dərhal cavablandırmaq üçün WhatsApp-dan yazın.</p>
                <a 
                    href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
                >
                    WhatsApp-a Yazın
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;