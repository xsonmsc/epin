import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { OrderStatus, ProductType } from '../types';
import { Clock, CheckCircle, Copy, Plus, Camera, Save, LogOut, Package, Zap, Heart, Settings, Eye, EyeOff, Edit, Shield, Mail, Phone, Gamepad2, Skull, Monitor, RefreshCw, Share2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Profile = () => {
  const { user, orders, updateUserProfile, changePassword, logout, products } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inventory' | 'subscriptions' | 'referral' | 'settings'>('inventory');
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [revealedOrders, setRevealedOrders] = useState<{[key: string]: boolean}>({});
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Profile Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      discordId: user?.discordId || '',
      steamId: user?.steamId || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security State
  const [passData, setPassData] = useState({ current: '', new: '' });
  const [passMsg, setPassMsg] = useState('');

  // Update timer every minute for subscriptions
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const myOrders = orders.filter(o => o.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const filteredOrders = myOrders.filter(o => orderFilter === 'ALL' || o.status === orderFilter);
  const wishlistProducts = products.filter(p => user?.wishlist?.includes(p.id));

  // Filter Active Subscriptions (Orders with expiryDate > now)
  const activeSubscriptions = myOrders.filter(o => o.expiryDate && new Date(o.expiryDate).getTime() > currentTime);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Kopyalandı!"); 
  };
  
  const toggleReveal = (orderId: string) => {
      setRevealedOrders(prev => ({...prev, [orderId]: !prev[orderId]}));
  };

  const maskCode = (code: string) => "••••-••••-••••-" + code.slice(-4);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const imageUrl = URL.createObjectURL(file);
          updateUserProfile({ avatar: imageUrl });
      }
  };

  const handleSaveProfile = () => {
      updateUserProfile(editForm);
      setIsEditing(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
      e.preventDefault();
      if (changePassword(passData.current, passData.new)) {
          setPassMsg("Şifrə uğurla dəyişdirildi!");
          setPassData({ current: '', new: '' });
      } else {
          setPassMsg("Cari şifrə yanlışdır.");
      }
  };

  const getDaysLeft = (expiryDate: string) => {
      const diff = new Date(expiryDate).getTime() - currentTime;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return { days, hours, totalMs: diff };
  };

  const calculateProgress = (dateStr: string, expiryStr: string) => {
      const start = new Date(dateStr).getTime();
      const end = new Date(expiryStr).getTime();
      const total = end - start;
      const elapsed = currentTime - start;
      return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  if(!user) return null;

  return (
    <div className="min-h-screen bg-gaming-dark py-10 px-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: User Card */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-gaming-card border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-gaming-neon/20 to-gaming-accent/20"></div>
                
                <div className="relative text-center mt-8">
                    <div className="relative inline-block group">
                        <div className="w-28 h-28 rounded-full border-4 border-gaming-card bg-slate-800 overflow-hidden relative shadow-lg">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500">{user.name.charAt(0)}</div>}
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-gaming-neon text-black p-2 rounded-full hover:scale-110 transition-transform shadow-lg">
                            <Camera className="w-4 h-4" />
                        </button>
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarUpload} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mt-4">{user.name}</h2>
                    <p className="text-gray-400 text-sm mb-4">{user.email}</p>
                    {user.bio && <p className="text-gray-300 text-sm italic mb-6">"{user.bio}"</p>}

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-gray-800 mb-6">
                        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Balans</p>
                        <div className="text-3xl font-mono font-bold text-gaming-neon">{user.balance.toFixed(2)} ₼</div>
                        <button onClick={() => navigate('/balance')} className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                            <Plus className="w-4 h-4"/> Artır
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {user.discordId && (
                            <div className="flex items-center gap-2 text-sm text-gray-400 bg-slate-900/30 p-2 rounded">
                                <Gamepad2 className="w-4 h-4 text-purple-400"/> {user.discordId}
                            </div>
                        )}
                        {user.steamId && (
                            <div className="flex items-center gap-2 text-sm text-gray-400 bg-slate-900/30 p-2 rounded">
                                <Monitor className="w-4 h-4 text-blue-400"/> {user.steamId}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gaming-card border border-gray-800 rounded-3xl p-4 shadow-xl">
                <nav className="flex flex-col gap-1">
                    <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activeTab === 'inventory' ? 'bg-gaming-neon text-black' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Package className="w-5 h-5"/> İnventar
                    </button>
                    <button onClick={() => setActiveTab('subscriptions')} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activeTab === 'subscriptions' ? 'bg-gaming-neon text-black' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Clock className="w-5 h-5"/> Abunəliklər
                    </button>
                    <button onClick={() => setActiveTab('referral')} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activeTab === 'referral' ? 'bg-gaming-neon text-black' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Share2 className="w-5 h-5"/> Dəvət Et
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activeTab === 'settings' ? 'bg-gaming-neon text-black' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Settings className="w-5 h-5"/> Ayarlar
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-red-500 hover:bg-red-500/10">
                        <LogOut className="w-5 h-5"/> Çıxış
                    </button>
                </nav>
            </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="lg:col-span-8">
            
            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Package className="text-gaming-neon"/> Sifariş Tarixçəsi</h3>
                            <div className="flex bg-slate-800 rounded p-1">
                                {['ALL', 'COMPLETED', 'PENDING'].map(status => (
                                    <button 
                                        key={status} 
                                        onClick={() => setOrderFilter(status as any)}
                                        className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${orderFilter === status ? 'bg-gaming-neon text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {status === 'ALL' ? 'Hamısı' : status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-gray-800">
                                    <Skull className="w-12 h-12 text-gray-600 mx-auto mb-2"/>
                                    <p className="text-gray-500">Heç bir sifariş tapılmadı.</p>
                                </div>
                            ) : (
                                filteredOrders.map(order => (
                                    <div key={order.id} className="bg-gaming-card border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center border border-gray-700 overflow-hidden">
                                                    {order.items[0]?.image ? <img src={order.items[0].image} className="w-full h-full object-cover"/> : <Package className="text-gray-600"/>}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{order.items.length > 1 ? `${order.items.length} Məhsul` : order.items[0]?.title}</h4>
                                                    <p className="text-xs text-gray-400 mt-1">{new Date(order.date).toLocaleDateString()} • #{order.id.slice(-6)}</p>
                                                    <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${
                                                        order.status === 'COMPLETED' ? 'border-green-500 text-green-400 bg-green-500/10' : 
                                                        order.status === 'PENDING' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 
                                                        'border-red-500 text-red-400'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gaming-neon font-bold text-lg">{order.totalPrice.toFixed(2)} ₼</p>
                                            </div>
                                        </div>

                                        {order.deliveredContent && (
                                            <div className="bg-black/40 border border-gray-700 rounded-lg p-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Məhsul Kodu / Məlumat</span>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => toggleReveal(order.id)} className="text-gray-400 hover:text-white"><Eye className="w-4 h-4"/></button>
                                                        <button onClick={() => copyToClipboard(order.deliveredContent!)} className="text-gray-400 hover:text-white"><Copy className="w-4 h-4"/></button>
                                                    </div>
                                                </div>
                                                <code className="block text-sm text-green-400 font-mono break-all bg-slate-900 p-2 rounded">
                                                    {revealedOrders[order.id] ? order.deliveredContent : maskCode(order.deliveredContent)}
                                                </code>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                    {/* Wishlist Section */}
                    {wishlistProducts.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Heart className="text-red-500 fill-current"/> Sevimlilər</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SUBSCRIPTIONS TAB */}
            {activeTab === 'subscriptions' && (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Clock className="text-gaming-neon"/> Aktiv Abunəliklər</h3>
                    
                    {activeSubscriptions.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-gray-800">
                             <Clock className="w-12 h-12 text-gray-600 mx-auto mb-2"/>
                             <p className="text-gray-500">Aktiv abunəliyiniz yoxdur.</p>
                             <button onClick={() => navigate('/')} className="text-gaming-neon font-bold mt-2 hover:underline">Mağazaya Keç</button>
                        </div>
                    ) : (
                        activeSubscriptions.map(sub => {
                            const { days, hours } = getDaysLeft(sub.expiryDate!);
                            const progress = calculateProgress(sub.date, sub.expiryDate!);
                            const isLow = days < 3;

                            return (
                                <div key={sub.id} className="bg-gaming-card border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gaming-neon"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                             <img src={sub.items[0].image} className="w-16 h-16 rounded-xl object-cover border border-gray-700" />
                                             <div>
                                                 <h4 className="font-bold text-lg text-white">{sub.items[0].title}</h4>
                                                 <p className="text-sm text-gray-400">Bitmə Tarixi: {new Date(sub.expiryDate!).toLocaleDateString()}</p>
                                             </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-2xl font-black ${isLow ? 'text-red-500' : 'text-green-500'}`}>{days} Gün</span>
                                            <p className="text-xs text-gray-500">{hours} saat qalıb</p>
                                        </div>
                                    </div>
                                    
                                    {/* Visual Progress Bar */}
                                    <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-gray-700 mb-4">
                                        <div 
                                            className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isLow ? 'bg-red-500' : progress > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                            style={{ width: `${100 - progress}%` }} 
                                        ></div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                                         <div className="flex gap-2">
                                             <span className="text-xs bg-slate-800 text-gray-300 px-2 py-1 rounded">Login: {sub.deliveredContent?.split(':')[0] || 'Gizli'}</span>
                                         </div>
                                         <button onClick={() => navigate(`/product/${sub.items[0].productId}`)} className="flex items-center gap-2 text-sm font-bold text-gaming-neon hover:text-white transition-colors">
                                             <RefreshCw className="w-4 h-4" /> Yenilə
                                         </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* REFERRAL TAB */}
            {activeTab === 'referral' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-3xl p-8 text-center">
                         <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                         <h2 className="text-2xl font-black text-white mb-2">Dostunu Dəvət Et, Qazan!</h2>
                         <p className="text-gray-300 mb-6 max-w-lg mx-auto">Sizin dəvət kodunuzla qeydiyyatdan keçən hər dostunuz üçün bonus qazanın. Nə qədər çox dost, o qədər çox qazanc!</p>
                         
                         <div className="bg-black/40 border border-purple-500/50 rounded-xl p-4 flex items-center justify-between max-w-md mx-auto mb-8">
                             <div className="text-left">
                                 <p className="text-xs text-purple-400 font-bold uppercase">Sizin Dəvət Kodunuz</p>
                                 <p className="text-2xl font-mono text-white tracking-widest font-bold">{user.referralCode || 'GAMEPAY'}</p>
                             </div>
                             <button onClick={() => copyToClipboard(user.referralCode || 'GAMEPAY')} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg transition-colors">
                                 <Copy className="w-5 h-5" />
                             </button>
                         </div>

                         <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                             <div className="bg-slate-900/50 p-4 rounded-xl border border-gray-700">
                                 <p className="text-gray-400 text-xs">Dəvət Edilən</p>
                                 <p className="text-2xl font-bold text-white">{user.referralCount || 0} nəfər</p>
                             </div>
                             <div className="bg-slate-900/50 p-4 rounded-xl border border-gray-700">
                                 <p className="text-gray-400 text-xs">Qazancınız</p>
                                 <p className="text-2xl font-bold text-green-400">{user.referralEarnings || 0} ₼</p>
                             </div>
                         </div>
                    </div>
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="bg-gaming-card border border-gray-800 rounded-3xl p-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="text-gaming-neon"/> Hesab Tənzimləmələri</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Info Form */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 border-b border-gray-800 pb-2">Şəxsi Məlumatlar</h4>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Ad Soyad</label>
                                <input className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-white" disabled={!isEditing} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Email</label>
                                <input className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-white" disabled={!isEditing} value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Haqqımda (Bio)</label>
                                <textarea className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-white h-20 resize-none" disabled={!isEditing} value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} placeholder="Özünüz haqqında qısa məlumat..."></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Discord ID</label>
                                    <input className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-white" disabled={!isEditing} value={editForm.discordId} onChange={e => setEditForm({...editForm, discordId: e.target.value})} placeholder="User#1234" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Steam ID</label>
                                    <input className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-white" disabled={!isEditing} value={editForm.steamId} onChange={e => setEditForm({...editForm, steamId: e.target.value})} placeholder="Steam Profile URL/ID" />
                                </div>
                            </div>

                            <div className="pt-2">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveProfile} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-500">Yadda Saxla</button>
                                        <button onClick={() => setIsEditing(false)} className="bg-slate-700 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-600">Ləğv Et</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="bg-slate-800 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-700 flex items-center gap-2"><Edit className="w-4 h-4"/> Düzəliş Et</button>
                                )}
                            </div>
                        </div>

                        {/* Security Form */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 border-b border-gray-800 pb-2">Təhlükəsizlik</h4>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Cari Şifrə</label>
                                    <input type="password" required className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-white" value={passData.current} onChange={e => setPassData({...passData, current: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Yeni Şifrə</label>
                                    <input type="password" required className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-white" value={passData.new} onChange={e => setPassData({...passData, new: e.target.value})} />
                                </div>
                                {passMsg && <p className={`text-xs ${passMsg.includes('uğurla') ? 'text-green-500' : 'text-red-500'}`}>{passMsg}</p>}
                                <button type="submit" className="w-full bg-gaming-neon hover:bg-cyan-400 text-black font-bold py-2 rounded transition-colors">Şifrəni Yenilə</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;