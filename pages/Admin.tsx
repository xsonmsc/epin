
import React, { useState, useRef } from 'react';
import { useApp } from '../store';
import { Order, OrderStatus, ProductType, Product, PromoCode, PaymentMethod, Blog, Agreement, HeroSlide } from '../types';
import { 
  BarChart3, ShoppingBag, Package, Users, Settings, LogOut, 
  Plus, Trash2, Search, Edit3, X, Check, Eye, Wallet, 
  Database, Infinity, Menu, FileText, MessageSquare, CreditCard, Globe, Shield, Image as ImageIcon, Save, Star, Layout, Link as LinkIcon, Info, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const { 
    user, orders, completeOrder, cancelOrder, products, 
    siteSettings, updateSiteSettings,
    categories, addCategory, deleteCategory, togglePopularCategory,
    addProduct, deleteProduct, togglePopularProduct,
    addAgreement, deleteAgreement,
    blogs, addBlog, deleteBlog,
    paymentMethods, addPaymentMethod, deletePaymentMethod, updatePaymentMethod,
    comments, deleteComment, logout,
    usersList, toggleUserBan, updateUserBalance,
    promoCodes, addPromoCode, deletePromoCode,
    stocks, addStock, deleteStock, activityLogs,
    heroSlides, addHeroSlide, deleteHeroSlide
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'stock' | 'users' | 'content' | 'finance' | 'settings' | 'design'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- STATE MANAGEMENT ---
  
  // Orders
  const [deliveryModal, setDeliveryModal] = useState<{orderId: string, productTitle: string} | null>(null);
  const [deliveryContent, setDeliveryContent] = useState('');
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Products
  const [productView, setProductView] = useState<'list' | 'add'>('list');
  const [productSearch, setProductSearch] = useState('');
  const [isEditingProd, setIsEditingProd] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '', categoryId: '', subCategory: '', price: 0, costPrice: 0, discountPercent: 0, type: ProductType.LICENSE_KEY, image: '', description: '', requiresInput: false, durationDays: 0, isLifetime: false, isPopular: false
  });
  const prodFileRef = useRef<HTMLInputElement>(null);

  // Stock
  const [stockProduct, setStockProduct] = useState('');
  const [stockInput, setStockInput] = useState('');

  // Users
  const [userSearch, setUserSearch] = useState('');

  // Content (News/Rules)
  const [contentSubTab, setContentSubTab] = useState<'news' | 'rules' | 'comments'>('news');
  const [blogForm, setBlogForm] = useState<{title: string, content: string, image: string}>({ title: '', content: '', image: '' });
  const [ruleForm, setRuleForm] = useState<{title: string, content: string}>({ title: '', content: '' });

  // Finance (Payments/Promo)
  const [financeSubTab, setFinanceSubTab] = useState<'payments' | 'promos'>('payments');
  const [payForm, setPayForm] = useState<Partial<PaymentMethod>>({ name: '', details: '', instructions: '', isActive: true, icon: 'credit-card' });
  const [promoForm, setPromoForm] = useState<{code: string, percent: number}>({ code: '', percent: 0 });

  // Settings (General/Categories)
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'categories'>('general');
  const [generalForm, setGeneralForm] = useState(siteSettings);
  const [catForm, setCatForm] = useState<{name: string, image: string}>({ name: '', image: '' });

  // Design (Banner)
  const [slideForm, setSlideForm] = useState<Partial<HeroSlide>>({ image: '', title: '', subtitle: '', desc: '', btnText: 'İndi Al', link: '/' });

  if (!user || user.role !== 'admin') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-bold text-2xl">
            Access Denied
        </div>
    );
  }

  // --- HELPERS ---
  
  const handleLogout = () => { logout(); navigate('/'); };

  const handleDelete = (type: string, id: string) => {
      if(window.confirm(`Silmək istədiyinizə əminsiniz?`)) {
          switch(type) {
              case 'product': deleteProduct(id); break;
              case 'category': deleteCategory(id); break;
              case 'promo': deletePromoCode(id); break;
              case 'comment': deleteComment(id); break;
              case 'stock': deleteStock(id); break;
              case 'blog': deleteBlog(id); break;
              case 'rule': deleteAgreement(id); break;
              case 'payment': deletePaymentMethod(id); break;
              case 'slide': deleteHeroSlide(id); break;
          }
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
      if(e.target.files?.[0]) setter(URL.createObjectURL(e.target.files[0]));
  };

  // Product Logic
  const handleEditProduct = (p: Product) => {
      setProductForm(p);
      setIsEditingProd(true);
      setProductView('add');
  };

  const handleSaveProduct = () => {
      if(!productForm.title || !productForm.price || !productForm.categoryId) {
          alert("Zəhmət olmasa vacib xanaları doldurun.");
          return;
      }
      const newProduct = { ...productForm, id: isEditingProd ? productForm.id! : `p-${Date.now()}` } as Product;
      if(isEditingProd) deleteProduct(productForm.id!);
      addProduct(newProduct);
      setProductView('list');
      setProductForm({ title: '', categoryId: '', subCategory: '', price: 0, costPrice: 0, discountPercent: 0, type: ProductType.LICENSE_KEY, image: '', description: '', requiresInput: false, durationDays: 0, isLifetime: false, isPopular: false });
      setIsEditingProd(false);
  };

  // Stock Logic
  const handleAddStock = () => {
      if(!stockProduct || !stockInput) return;
      const codes = stockInput.split('\n').filter(c => c.trim().length > 0);
      addStock(stockProduct, codes);
      setStockInput('');
      alert(`${codes.length} ədəd kod əlavə olundu.`);
  };

  // Order Logic
  const confirmDelivery = () => {
      if(deliveryModal) {
          completeOrder(deliveryModal.orderId, deliveryContent);
          setDeliveryModal(null);
      }
  };

  // Settings Logic
  const saveGeneralSettings = () => {
      updateSiteSettings(generalForm);
      alert("Ayarlar yadda saxlanıldı!");
  };

  // Menu Items
  const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'orders', label: 'Sifarişlər', icon: ShoppingBag, badge: orders.filter(o => o.status === 'PENDING').length },
      { id: 'products', label: 'Məhsullar', icon: Package },
      { id: 'stock', label: 'Stok', icon: Database },
      { id: 'design', label: 'Dizayn & Banner', icon: Layout },
      { id: 'users', label: 'İstifadəçilər', icon: Users },
      { id: 'content', label: 'Məzmun & Rəy', icon: FileText },
      { id: 'finance', label: 'Maliyyə', icon: CreditCard },
      { id: 'settings', label: 'Ümumi Ayarlar', icon: Settings },
  ];

  const filteredOrders = orders.filter(o => orderFilter === 'ALL' || o.status === orderFilter);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass border-r border-white/10 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <span className="text-xl font-black text-white tracking-widest uppercase">Admin</span>
              <button onClick={() => setMobileMenuOpen(false)} className="md:hidden"><X /></button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map(item => (
                  <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                      <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge ? <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span> : null}
                  </button>
              ))}
          </nav>

          <div className="p-4 border-t border-white/10">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold">
                  <LogOut className="w-5 h-5" /> Çıxış
              </button>
          </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden glass border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-40">
          <span className="font-bold text-lg">Admin Panel</span>
          <button onClick={() => setMobileMenuOpen(true)}><Menu /></button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto bg-background">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-3xl font-bold mb-6">İdarə Paneli</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="glass-card p-6 rounded-2xl">
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Ümumi Gəlir</p>
                          <p className="text-3xl font-mono font-bold text-white mt-2">
                              {orders.filter(o => o.status === 'COMPLETED' && !o.items.some(i => i.type === ProductType.BALANCE)).reduce((acc, o) => acc + o.totalPrice, 0).toFixed(2)} ₼
                          </p>
                      </div>
                      <div className="glass-card p-6 rounded-2xl">
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">İstifadəçilər</p>
                          <p className="text-3xl font-bold text-white mt-2">{usersList.length}</p>
                      </div>
                      <div className="glass-card p-6 rounded-2xl">
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Gözləyən Sifariş</p>
                          <p className="text-3xl font-bold text-yellow-500 mt-2">{orders.filter(o => o.status === 'PENDING').length}</p>
                      </div>
                      <div className="glass-card p-6 rounded-2xl">
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Stokda Kodlar</p>
                          <p className="text-3xl font-bold text-blue-500 mt-2">{stocks.filter(s => !s.isUsed).length}</p>
                      </div>
                  </div>
              </div>
          )}

          {/* ... [ORDERS SECTION UNCHANGED] ... */}
          {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                   <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Sifariş İdarəçiliyi</h2>
                        <div className="flex bg-white/5 rounded-lg p-1">
                            {(['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setOrderFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${orderFilter === status ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {status === 'ALL' ? 'HAMISI' : status}
                                </button>
                            ))}
                        </div>
                   </div>

                   <div className="space-y-4">
                       {filteredOrders.length === 0 ? <div className="text-center py-12 text-gray-500">Sifariş tapılmadı.</div> : filteredOrders.map(order => (
                           <div key={order.id} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
                               <div className="flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-gray-500">#{order.id.slice(-6)}</span>
                                        <span className="text-xs text-gray-400">• {new Date(order.date).toLocaleString()}</span>
                                   </div>
                                   <h4 className="font-bold text-white text-lg">{order.productTitle}</h4>
                                   <p className="text-sm text-gray-400">İstifadəçi: <span className="text-white">{order.userId}</span></p>
                                   <div className="flex gap-2 mt-2 flex-wrap">
                                        {order.items.map((item, idx) => (
                                            <span key={idx} className="bg-white/5 px-2 py-1 rounded text-xs text-gray-300">
                                                {item.title} (x{item.quantity}) {item.userInput ? `- ${item.userInput}` : ''}
                                            </span>
                                        ))}
                                   </div>
                                   {order.receiptImage && (
                                       <a href={order.receiptImage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
                                           <Eye className="w-3 h-3"/> Qəbzə Bax
                                       </a>
                                   )}
                               </div>
                               <div className="text-right min-w-[120px]">
                                   <p className="text-2xl font-bold text-white">{order.totalPrice.toFixed(2)} ₼</p>
                                   <p className="text-xs text-gray-400 mb-2">{order.paymentMethodName}</p>
                                   <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                       {order.status}
                                   </span>
                               </div>
                               {order.status === 'PENDING' && (
                                   <div className="flex flex-col gap-2 min-w-[140px]">
                                        <button onClick={() => { setDeliveryModal({ orderId: order.id, productTitle: order.productTitle || 'Məhsul' }); setDeliveryContent(''); }} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                                            <Check className="w-4 h-4" /> Təsdiqlə
                                        </button>
                                        <button onClick={() => { if(window.confirm('Ləğv edilsin?')) cancelOrder(order.id); }} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                                            <X className="w-4 h-4" /> Ləğv Et
                                        </button>
                                   </div>
                               )}
                           </div>
                       ))}
                   </div>
              </div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold">Məhsullar</h3>
                      <button onClick={() => { setProductView(productView === 'list' ? 'add' : 'list'); setIsEditingProd(false); setProductForm({ title: '', categoryId: '', subCategory: '', price: 0, costPrice: 0, discountPercent: 0, type: ProductType.LICENSE_KEY, image: '', description: '', requiresInput: false, durationDays: 0, isLifetime: false, isPopular: false }); }} className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                          {productView === 'list' ? <><Plus className="w-4 h-4"/> Yeni Məhsul</> : 'Siyahıya Qayıt'}
                      </button>
                  </div>

                  {productView === 'add' ? (
                      <div className="glass-card p-8 rounded-2xl border border-white/10">
                          <h4 className="text-lg font-bold mb-6 text-primary">{isEditingProd ? 'Redaktə Et' : 'Yeni Məhsul'}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                  <div>
                                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Məhsul Adı</label>
                                    <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Satış Qiyməti (AZN)</label>
                                          <input type="number" className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} />
                                      </div>
                                      <div>
                                          <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Kateqoriya</label>
                                          <select className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})}>
                                              <option value="">Seçin</option>
                                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                          </select>
                                      </div>
                                  </div>
                                  {/* SubCategory Input */}
                                  <div>
                                      <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Alt Kateqoriya (Opsional)</label>
                                      <div className="relative">
                                          <Tag className="absolute left-3 top-3.5 w-4 h-4 text-gray-500"/>
                                          <input 
                                            className="w-full bg-surfaceHighlight border border-white/10 rounded-xl pl-10 pr-3 py-3 text-white focus:border-primary outline-none" 
                                            placeholder="Məs: Premium, 4K, Standart" 
                                            value={productForm.subCategory || ''} 
                                            onChange={e => setProductForm({...productForm, subCategory: e.target.value})} 
                                          />
                                      </div>
                                  </div>

                                  <div className="border-2 border-dashed border-white/10 rounded-xl h-40 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors overflow-hidden relative" onClick={() => prodFileRef.current?.click()}>
                                      {productForm.image ? <img src={productForm.image} className="h-full w-full object-cover"/> : <div className="text-center"><div className="bg-white/10 p-3 rounded-full inline-block mb-2"><Plus className="w-6 h-6 text-gray-400"/></div><p className="text-gray-500 text-xs uppercase font-bold">Şəkil Seçin</p></div>}
                                      <input type="file" hidden ref={prodFileRef} onChange={e => handleImageUpload(e, url => setProductForm({...productForm, image: url}))} />
                                  </div>
                                  <p className="text-xs text-gray-500 flex items-center gap-1"><Info className="w-3 h-3"/> Tövsiyə: 800x800px (1:1)</p>
                              </div>
                              <div className="space-y-4">
                                  <div>
                                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Məhsul Tipi</label>
                                    <select className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value as ProductType})}>
                                        <option value={ProductType.LICENSE_KEY}>License Key</option>
                                        <option value={ProductType.ACCOUNT}>Account</option>
                                        <option value={ProductType.ID_LOAD}>ID Load</option>
                                    </select>
                                  </div>
                                  <div className="flex gap-4">
                                      <div className="flex-1 bg-surfaceHighlight p-4 rounded-xl border border-white/10 flex items-center gap-3">
                                          <input type="checkbox" id="isLifetime" checked={productForm.isLifetime} onChange={e => setProductForm({...productForm, isLifetime: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-black checked:bg-primary" />
                                          <label htmlFor="isLifetime" className="text-sm font-bold flex items-center gap-2 cursor-pointer"><Infinity className="w-4 h-4 text-primary" /> Ömürlük</label>
                                      </div>
                                      <div className="flex-1 bg-surfaceHighlight p-4 rounded-xl border border-white/10 flex items-center gap-3">
                                          <input type="checkbox" id="isPopular" checked={productForm.isPopular} onChange={e => setProductForm({...productForm, isPopular: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-black checked:bg-primary" />
                                          <label htmlFor="isPopular" className="text-sm font-bold flex items-center gap-2 cursor-pointer"><Star className="w-4 h-4 text-yellow-500" /> Populyar</label>
                                      </div>
                                  </div>
                                  <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/10 flex items-center gap-3">
                                      <input type="checkbox" id="requiresInput" checked={productForm.requiresInput} onChange={e => setProductForm({...productForm, requiresInput: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-black checked:bg-primary" />
                                      <label htmlFor="requiresInput" className="text-sm font-bold flex items-center gap-2 cursor-pointer"><Edit3 className="w-4 h-4 text-primary" /> Müştəri Məlumatı Tələb Et</label>
                                  </div>
                                  {productForm.requiresInput && (
                                      <div>
                                          <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Input Label</label>
                                          <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" value={productForm.inputLabel || ''} onChange={e => setProductForm({...productForm, inputLabel: e.target.value})} placeholder="Məs: Hesab ID" />
                                      </div>
                                  )}
                                  <textarea className="w-full h-24 bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white resize-none focus:border-primary outline-none" placeholder="Təsvir..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}></textarea>
                                  <button onClick={handleSaveProduct} className="w-full bg-primary hover:bg-primary-dark font-bold py-4 rounded-xl text-white uppercase tracking-widest transition-colors shadow-lg shadow-primary/20">{isEditingProd ? 'Yenilə' : 'Əlavə Et'}</button>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
                          <div className="p-4 border-b border-white/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                                <input placeholder="Məhsul Axtar..." className="w-full bg-surfaceHighlight rounded-xl pl-10 pr-4 py-3 text-white border border-white/5 focus:border-primary outline-none placeholder-gray-500 transition-colors" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                  <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                      <tr><th className="p-4">Şəkil</th><th className="p-4">Ad</th><th className="p-4">Alt Kat.</th><th className="p-4">Qiymət</th><th className="p-4">Populyar</th><th className="p-4 text-right">Əməliyyat</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/5 text-sm">
                                      {products.filter(p => p.title.toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                                          <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                              <td className="p-4"><img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-surfaceHighlight border border-white/10"/></td>
                                              <td className="p-4">
                                                  <p className="font-bold text-white">{p.title}</p>
                                                  <p className="text-xs text-gray-500">{categories.find(c => c.id === p.categoryId)?.name}</p>
                                              </td>
                                              <td className="p-4 text-gray-400 text-xs">{p.subCategory || '-'}</td>
                                              <td className="p-4 text-primary font-bold">{p.price.toFixed(2)} ₼</td>
                                              <td className="p-4">
                                                  <button onClick={() => togglePopularProduct(p.id)} className={`p-1 rounded ${p.isPopular ? 'text-yellow-400' : 'text-gray-600'}`}>
                                                      <Star className={`w-5 h-5 ${p.isPopular ? 'fill-current' : ''}`} />
                                                  </button>
                                              </td>
                                              <td className="p-4 text-right">
                                                  <div className="flex items-center justify-end gap-2">
                                                      <button onClick={() => handleEditProduct(p)} className="p-2 bg-white/10 rounded-lg hover:bg-white hover:text-black transition-colors"><Edit3 className="w-4 h-4"/></button>
                                                      <button onClick={() => handleDelete('product', p.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4"/></button>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* ... [REST OF THE FILE UNCHANGED] ... */}
          {/* STOCK, USERS, CONTENT, FINANCE, SETTINGS, DESIGN */}
          {activeTab === 'stock' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Database className="text-primary"/> Stok Əlavə Et</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs uppercase font-bold text-gray-400 mb-2">Məhsul Seçin</label>
                              <select className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" value={stockProduct} onChange={e => setStockProduct(e.target.value)}>
                                  <option value="">Seçin...</option>
                                  {products.filter(p => p.type === ProductType.LICENSE_KEY || p.type === ProductType.ACCOUNT).map(p => (
                                      <option key={p.id} value={p.id}>{p.title} (Cari: {stocks.filter(s => s.productId === p.id && !s.isUsed).length})</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs uppercase font-bold text-gray-400 mb-2">Kodlar / Məlumatlar</label>
                              <textarea className="w-full h-32 bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none font-mono text-sm" placeholder={`Hər sətirə bir kod.\nAAAA-BBBB-CCCC`} value={stockInput} onChange={e => setStockInput(e.target.value)}></textarea>
                              <button onClick={handleAddStock} disabled={!stockProduct || !stockInput} className="mt-3 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">Stoka Əlavə Et</button>
                          </div>
                      </div>
                  </div>
                  {/* ... stock table ... */}
                  <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
                      <div className="p-4 border-b border-white/10 bg-white/5"><h4 className="font-bold text-sm uppercase">Mövcud Stoklar</h4></div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-white/5 text-gray-400 uppercase text-xs"><tr><th className="p-4">Məhsul</th><th className="p-4">Kod</th><th className="p-4">Status</th><th className="p-4 text-right">Sil</th></tr></thead>
                              <tbody className="divide-y divide-white/5">
                                  {stocks.map(stock => {
                                      const prod = products.find(p => p.id === stock.productId);
                                      return (
                                          <tr key={stock.id} className="hover:bg-white/5">
                                              <td className="p-4 font-bold text-gray-300">{prod?.title || 'Unknown'}</td>
                                              <td className="p-4 font-mono text-xs">{stock.code}</td>
                                              <td className="p-4">{stock.isUsed ? <span className="text-red-400 text-xs font-bold">İSTİFADƏ OLUNUB</span> : <span className="text-green-400 text-xs font-bold">AKTİV</span>}</td>
                                              <td className="p-4 text-right"><button onClick={() => handleDelete('stock', stock.id)} className="text-red-500 hover:text-white"><X className="w-4 h-4"/></button></td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}

          {/* ... [Rest of tabs are the same, just ensured they render] ... */}
          {activeTab === 'users' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <div className="flex justify-between items-center gap-4 mb-6">
                           <h3 className="text-xl font-bold flex items-center gap-2"><Users className="text-primary"/> İstifadəçilər</h3>
                           <div className="relative w-full md:w-64">
                               <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                               <input className="w-full bg-surfaceHighlight rounded-xl pl-10 pr-4 py-2 text-white border border-white/5 focus:border-primary outline-none" placeholder="Email və ya ad axtar..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                           </div>
                      </div>
                      {/* User Table */}
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-white/5 text-gray-400 uppercase text-xs"><tr><th className="p-4">İstifadəçi</th><th className="p-4">Balans</th><th className="p-4">Status</th><th className="p-4 text-right">Əməliyyat</th></tr></thead>
                              <tbody className="divide-y divide-white/5">
                                  {usersList.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.includes(userSearch)).map(u => (
                                      <tr key={u.id} className="hover:bg-white/5">
                                          <td className="p-4">
                                              <p className="font-bold text-white">{u.name}</p>
                                              <p className="text-xs text-gray-500">{u.email}</p>
                                          </td>
                                          <td className="p-4 font-mono font-bold text-primary">{u.balance.toFixed(2)} ₼</td>
                                          <td className="p-4">{u.isBanned ? <span className="text-red-500 font-bold text-xs">BANNED</span> : <span className="text-green-500 font-bold text-xs">AKTİV</span>}</td>
                                          <td className="p-4 text-right flex justify-end gap-2">
                                              <button onClick={() => { const amount = prompt("Artırılacaq məbləğ:"); if(amount) updateUserBalance(u.id, parseFloat(amount)); }} className="p-2 bg-green-500/10 text-green-400 rounded"><Wallet className="w-4 h-4"/></button>
                                              <button onClick={() => toggleUserBan(u.id)} className="p-2 bg-red-500/10 text-red-400 rounded"><Shield className="w-4 h-4"/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'design' && (
              <div className="space-y-6 animate-fade-in">
                   <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Layout className="text-primary"/> Slider (Banner) İdarəçiliyi</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-3">
                               <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Başlıq (Title)" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} />
                               <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Alt Başlıq (Subtitle)" value={slideForm.subtitle} onChange={e => setSlideForm({...slideForm, subtitle: e.target.value})} />
                               <textarea className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Təsvir (Description)" value={slideForm.desc} onChange={e => setSlideForm({...slideForm, desc: e.target.value})}></textarea>
                           </div>
                           <div className="space-y-3">
                               <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Şəkil URL" value={slideForm.image} onChange={e => setSlideForm({...slideForm, image: e.target.value})} />
                               <p className="text-xs text-gray-500 flex items-center gap-1"><Info className="w-3 h-3"/> Tövsiyə: 1920x600px (3:1)</p>
                               <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Link (Məs: /category/cat_pubg)" value={slideForm.link} onChange={e => setSlideForm({...slideForm, link: e.target.value})} />
                               <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Düymə Yazısı" value={slideForm.btnText} onChange={e => setSlideForm({...slideForm, btnText: e.target.value})} />
                               <button 
                                 onClick={() => { 
                                     if(slideForm.image && slideForm.title) {
                                         addHeroSlide({ id: `slide-${Date.now()}`, image: slideForm.image!, title: slideForm.title!, subtitle: slideForm.subtitle!, desc: slideForm.desc!, btnText: slideForm.btnText!, link: slideForm.link! });
                                         setSlideForm({ image: '', title: '', subtitle: '', desc: '', btnText: 'İndi Al', link: '/' });
                                     }
                                 }} 
                                 className="w-full bg-primary py-3 rounded-xl font-bold text-white mt-2"
                               >
                                   Slayd Əlavə Et
                               </button>
                           </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                       {heroSlides.map(slide => (
                           <div key={slide.id} className="glass-card p-4 rounded-xl flex items-center gap-4">
                               <img src={slide.image} className="w-32 h-20 object-cover rounded-lg border border-white/10" alt="Slide" />
                               <div className="flex-1">
                                   <h4 className="font-bold text-white">{slide.title}</h4>
                                   <p className="text-gray-400 text-sm">{slide.subtitle}</p>
                                   <p className="text-primary text-xs flex items-center gap-1 mt-1"><LinkIcon className="w-3 h-3"/> {slide.link}</p>
                               </div>
                               <button onClick={() => handleDelete('slide', slide.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5"/></button>
                           </div>
                       ))}
                   </div>
              </div>
          )}

          {/* Content, Finance, Settings tabs are basically same structure, ensuring they render */}
          {activeTab === 'content' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex gap-4 mb-6 border-b border-white/10 pb-2">
                      <button onClick={() => setContentSubTab('news')} className={`pb-2 px-4 font-bold ${contentSubTab === 'news' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Xəbərlər</button>
                      <button onClick={() => setContentSubTab('rules')} className={`pb-2 px-4 font-bold ${contentSubTab === 'rules' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Qaydalar</button>
                      <button onClick={() => setContentSubTab('comments')} className={`pb-2 px-4 font-bold ${contentSubTab === 'comments' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Rəylər</button>
                  </div>
                  {/* News form, Rules form, Comments list... (Same as before) */}
                  {contentSubTab === 'news' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Blog Form */}
                          <div className="glass-card p-6 rounded-2xl border border-white/10">
                              <h4 className="font-bold mb-4">Yeni Xəbər</h4>
                              <div className="space-y-3">
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Başlıq" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Şəkil URL" value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} />
                                  <p className="text-xs text-gray-500 flex items-center gap-1"><Info className="w-3 h-3"/> Tövsiyə: 1200x600px (2:1)</p>
                                  <textarea className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white h-32" placeholder="Məzmun" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})}></textarea>
                                  <button onClick={() => { addBlog({id: `b-${Date.now()}`, date: new Date().toISOString(), ...blogForm}); setBlogForm({title:'',content:'',image:''}); }} className="w-full bg-primary py-3 rounded-xl font-bold">Paylaş</button>
                              </div>
                          </div>
                          {/* Blog List */}
                          <div className="space-y-4">
                              {blogs.map(b => (
                                  <div key={b.id} className="glass-card p-4 rounded-xl flex gap-4 items-center">
                                      <img src={b.image} className="w-16 h-16 rounded object-cover" />
                                      <div className="flex-1">
                                          <h5 className="font-bold">{b.title}</h5>
                                          <p className="text-xs text-gray-400 truncate">{b.content}</p>
                                      </div>
                                      <button onClick={() => handleDelete('blog', b.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
                  {contentSubTab === 'rules' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="glass-card p-6 rounded-2xl border border-white/10">
                              <h4 className="font-bold mb-4">Qayda / Razılaşma Əlavə Et</h4>
                              <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white mb-3" placeholder="Başlıq" value={ruleForm.title} onChange={e => setRuleForm({...ruleForm, title: e.target.value})} />
                              <textarea className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white h-64 mb-3" placeholder="Məzmun" value={ruleForm.content} onChange={e => setRuleForm({...ruleForm, content: e.target.value})}></textarea>
                              <button onClick={() => { addAgreement({id: `a-${Date.now()}`, ...ruleForm}); setRuleForm({title:'',content:''}); }} className="w-full bg-primary py-3 rounded-xl font-bold">Əlavə Et</button>
                          </div>
                          <div className="space-y-4">
                              {addAgreement && useApp().agreements.map(a => (
                                  <div key={a.id} className="glass-card p-4 rounded-xl">
                                      <div className="flex justify-between items-center mb-2">
                                          <h5 className="font-bold text-primary">{a.title}</h5>
                                          <button onClick={() => handleDelete('rule', a.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                                      </div>
                                      <p className="text-xs text-gray-400 line-clamp-3">{a.content}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
                  {contentSubTab === 'comments' && (
                      <div className="glass-card p-6 rounded-2xl border border-white/10">
                          <h4 className="font-bold mb-4">İstifadəçi Rəyləri</h4>
                          <div className="space-y-4">
                              {comments.length === 0 ? <p className="text-gray-500">Rəy yoxdur.</p> : comments.map(c => (
                                  <div key={c.id} className="border-b border-white/10 pb-4 flex justify-between items-start">
                                      <div>
                                          <p className="font-bold text-white text-sm">{c.author} <span className="text-yellow-500 ml-2">★ {c.rating}</span></p>
                                          <p className="text-gray-300 text-sm mt-1">"{c.content}"</p>
                                          <p className="text-xs text-gray-500 mt-1">{new Date(c.date).toLocaleString()} • Product: {products.find(p=>p.id===c.targetId)?.title}</p>
                                      </div>
                                      <button onClick={() => handleDelete('comment', c.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* Finance and Settings tabs basically same logic */}
          {activeTab === 'finance' && (
              <div className="space-y-6 animate-fade-in">
                   <div className="flex gap-4 mb-6 border-b border-white/10 pb-2">
                      <button onClick={() => setFinanceSubTab('payments')} className={`pb-2 px-4 font-bold ${financeSubTab === 'payments' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Ödəniş Üsulları</button>
                      <button onClick={() => setFinanceSubTab('promos')} className={`pb-2 px-4 font-bold ${financeSubTab === 'promos' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Promo Kodlar</button>
                  </div>
                  {financeSubTab === 'payments' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Payment Form */}
                          <div className="glass-card p-6 rounded-2xl border border-white/10">
                              <h4 className="font-bold mb-4">Yeni Ödəniş Üsulu</h4>
                              <div className="space-y-3">
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Ad (Məs: Birbank)" value={payForm.name} onChange={e => setPayForm({...payForm, name: e.target.value})} />
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Detallar (Kart nömrəsi)" value={payForm.details} onChange={e => setPayForm({...payForm, details: e.target.value})} />
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Təlimat (Qeyd)" value={payForm.instructions} onChange={e => setPayForm({...payForm, instructions: e.target.value})} />
                                  <button onClick={() => { addPaymentMethod({id: `pm-${Date.now()}`, ...payForm} as PaymentMethod); setPayForm({name:'', details:'', instructions:'', isActive:true, icon:'credit-card'}); }} className="w-full bg-primary py-3 rounded-xl font-bold">Əlavə Et</button>
                              </div>
                          </div>
                          {/* List */}
                          <div className="space-y-4">
                              {paymentMethods.map(pm => (
                                  <div key={pm.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                                      <div>
                                          <p className="font-bold text-white">{pm.name}</p>
                                          <p className="text-xs text-gray-400 font-mono">{pm.details}</p>
                                      </div>
                                      <div className="flex gap-2">
                                          <button onClick={() => updatePaymentMethod(pm.id, { isActive: !pm.isActive })} className={`px-2 py-1 rounded text-xs font-bold ${pm.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{pm.isActive ? 'Aktiv' : 'Deaktiv'}</button>
                                          <button onClick={() => handleDelete('payment', pm.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
                  {financeSubTab === 'promos' && (
                      <div className="glass-card p-6 rounded-2xl border border-white/10">
                          {/* Promo Form and List */}
                          <h4 className="font-bold mb-4">Promo Kodlar</h4>
                          <div className="flex gap-4 mb-6">
                              <input className="flex-1 bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white uppercase" placeholder="Kod" value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value})} />
                              <input type="number" className="w-32 bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Faiz" value={promoForm.percent} onChange={e => setPromoForm({...promoForm, percent: parseInt(e.target.value)})} />
                              <button onClick={() => { addPromoCode({id: `pr-${Date.now()}`, code: promoForm.code, discountPercent: promoForm.percent, isActive: true}); setPromoForm({code:'', percent:0}); }} className="bg-white text-black px-6 rounded-xl font-bold">Yarat</button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {promoCodes.map(p => (
                                  <div key={p.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                                      <div><p className="font-bold">{p.code}</p><p className="text-primary text-xs font-bold">{p.discountPercent}%</p></div>
                                      <button onClick={() => handleDelete('promo', p.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                  {/* Settings tabs */}
                  <div className="flex gap-4 mb-6 border-b border-white/10 pb-2">
                      <button onClick={() => setSettingsSubTab('general')} className={`pb-2 px-4 font-bold ${settingsSubTab === 'general' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Ümumi Ayarlar</button>
                      <button onClick={() => setSettingsSubTab('categories')} className={`pb-2 px-4 font-bold ${settingsSubTab === 'categories' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Kateqoriyalar</button>
                  </div>
                  {settingsSubTab === 'general' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* General Settings Form */}
                          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                              <h4 className="font-bold text-lg text-primary mb-2 flex items-center gap-2"><Globe className="w-5 h-5"/> Sayt Məlumatları</h4>
                              <div>
                                  <label className="text-xs text-gray-500 block mb-1">Sayt Adı</label>
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" value={generalForm.siteName} onChange={e => setGeneralForm({...generalForm, siteName: e.target.value})} />
                              </div>
                              {/* ... other inputs like HeroTitle, LogoUrl ... */}
                              <div>
                                  <label className="text-xs text-gray-500 block mb-1">Footer Yazısı</label>
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" value={generalForm.footerText} onChange={e => setGeneralForm({...generalForm, footerText: e.target.value})} />
                              </div>
                          </div>
                          {/* Contact Info */}
                          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                              <h4 className="font-bold text-lg text-primary mb-2 flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Əlaqə & Sosial</h4>
                              <div>
                                  <label className="text-xs text-gray-500 block mb-1">WhatsApp Nömrəsi</label>
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" value={generalForm.whatsappNumber} onChange={e => setGeneralForm({...generalForm, whatsappNumber: e.target.value})} />
                              </div>
                              {/* ... other contact inputs ... */}
                              <button onClick={saveGeneralSettings} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4"><Save className="w-5 h-5"/> Yadda Saxla</button>
                          </div>
                      </div>
                  )}
                  {settingsSubTab === 'categories' && (
                      <div className="glass-card p-6 rounded-2xl border border-white/10">
                          {/* Categories Form */}
                          <h4 className="font-bold mb-4">Kateqoriyaları İdarə Et</h4>
                          <div className="flex gap-4 mb-6">
                              <input className="flex-1 bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Ad" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} />
                              <div className="flex-1">
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Şəkil URL" value={catForm.image} onChange={e => setCatForm({...catForm, image: e.target.value})} />
                                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3"/> Tövsiyə: 500x500px (1:1)</p>
                              </div>
                              <button onClick={() => { addCategory({id: `c-${Date.now()}`, name: catForm.name, image: catForm.image, isPopular: false}); setCatForm({name:'', image:''}); }} className="bg-white text-black px-6 rounded-xl font-bold h-12">Əlavə Et</button>
                          </div>
                          <table className="w-full text-left text-sm">
                              <thead className="bg-white/5 text-gray-400 uppercase text-xs"><tr><th className="p-3">Ad</th><th className="p-3">Populyar</th><th className="p-3 text-right">Sil</th></tr></thead>
                              <tbody>
                                  {categories.map(c => (
                                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                                          <td className="p-3 font-bold text-white flex items-center gap-2">
                                              {c.image && <img src={c.image} className="w-8 h-8 rounded object-cover"/>}
                                              {c.name}
                                          </td>
                                          <td className="p-3">
                                              <button onClick={() => togglePopularCategory(c.id)} className={`p-1 rounded ${c.isPopular ? 'text-yellow-400' : 'text-gray-600'}`}>
                                                  <Star className={`w-5 h-5 ${c.isPopular ? 'fill-current' : ''}`} />
                                              </button>
                                          </td>
                                          <td className="p-3 text-right"><button onClick={() => handleDelete('category', c.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button></td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}
              </div>
          )}

      </div>

      {/* DELIVERY MODAL */}
      {deliveryModal && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="glass-card p-6 border border-white/10 w-full max-w-lg shadow-2xl animate-fade-in rounded-2xl">
                  <h3 className="text-xl font-bold mb-2 text-white">Sifarişi Tamamla</h3>
                  <p className="text-gray-400 text-sm mb-4">Məhsul: <span className="text-white font-bold">{deliveryModal.productTitle}</span></p>
                  <textarea 
                      className="w-full bg-surfaceHighlight border border-white/10 p-4 text-white h-40 font-mono focus:border-primary outline-none rounded-xl text-sm" 
                      value={deliveryContent} 
                      onChange={(e) => setDeliveryContent(e.target.value)}
                      placeholder="Müştəriyə göndəriləcək məlumat (Kod, Login və s.)..."
                  ></textarea>
                  <div className="flex justify-end gap-3 mt-4">
                      <button onClick={() => setDeliveryModal(null)} className="px-4 py-2 text-gray-400 hover:text-white uppercase text-xs font-bold">Bağla</button>
                      <button onClick={confirmDelivery} className="px-6 py-2 font-bold bg-primary text-white rounded-xl hover:bg-primary-dark uppercase text-xs transition-colors shadow-lg shadow-primary/20">Təsdiqlə</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Admin;
