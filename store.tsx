import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order, PaymentMethod, User, OrderStatus, ProductType, Category, SiteSettings, Blog, Agreement, Comment, CartItem, PromoCode, Notification, StockCode, ActivityLog } from './types';
import { INITIAL_PRODUCTS, INITIAL_PAYMENT_METHODS, MOCK_USERS, INITIAL_CATEGORIES, INITIAL_SETTINGS, MOCK_PROMO_CODES } from './constants';

interface AppContextType {
  user: User | null; 
  usersList: User[];
  isAuthenticated: boolean;
  products: Product[];
  categories: Category[];
  orders: Order[];
  paymentMethods: PaymentMethod[];
  promoCodes: PromoCode[];
  siteSettings: SiteSettings;
  blogs: Blog[];
  agreements: Agreement[];
  comments: Comment[];
  cart: CartItem[];
  notifications: Notification[];
  stocks: StockCode[]; 
  activityLogs: ActivityLog[]; 
  
  // Auth
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  changePassword: (currentPass: string, newPass: string) => boolean;
  requestPasswordReset: (phone: string) => boolean;
  adminUpdateUserPassword: (userId: string, newPass: string) => void;
  toggleUserBan: (userId: string) => void;
  generateResetLink: (userId: string) => string;
  confirmPasswordReset: (token: string, newPass: string) => boolean;
  toggleWishlist: (productId: string) => void; 

  // Cart
  addToCart: (product: Product, userInput?: string) => void;
  updateCartQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

  // Order Actions
  placeOrder: (paymentMethodId: string | 'BALANCE', receiptFile?: File, promoDiscount?: number) => Promise<boolean>;
  placeBalanceOrder: (amount: number, paymentMethodId: string, receiptFile: File) => Promise<boolean>;
  processOrder: (orderId: string) => void;
  completeOrder: (orderId: string, manualContent?: string) => void; 
  cancelOrder: (orderId: string) => void;
  
  // Notification Actions
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Admin CMS & Stock
  addProduct: (product: Product) => void;
  addProducts: (newProducts: Product[]) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  updateUserBalance: (amount: number) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  updatePaymentMethod: (id: string, details: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  addPromoCode: (promo: PromoCode) => void;
  deletePromoCode: (id: string) => void;
  togglePromoCode: (id: string) => void;
  
  // Stock Logic
  addStock: (productId: string, codes: string[]) => void;
  deleteStock: (stockId: string) => void;
  
  // CMS
  addBlog: (blog: Blog) => void;
  deleteBlog: (id: string) => void;
  addAgreement: (agreement: Agreement) => void;
  deleteAgreement: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'date' | 'isApproved'>) => void;
  toggleCommentApproval: (id: string) => void;
  deleteComment: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(MOCK_PROMO_CODES);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [stocks, setStocks] = useState<StockCode[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  // CMS State
  const [blogs, setBlogs] = useState<Blog[]>([
    { id: 'b1', title: 'GPT-4o Artıq Aktivdir!', content: 'OpenAI-ın ən yeni modeli artıq platformamızda mövcuddur.', date: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995' }
  ]);
  const [agreements, setAgreements] = useState<Agreement[]>([
    { id: 'a1', title: 'İstifadəçi Razılaşması', content: 'Saytımızdan istifadə edərkən...' },
    { id: 'a2', title: 'Zəmanət Şərtləri', content: 'Bütün məhsullara rəsmi zəmanət verilir...' }
  ]);
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', author: 'Sənan Q.', content: 'Canva Pro ömürlük aldım, dərhal aktivləşdi. Əla!', type: 'product', targetId: 'p2', isApproved: true, date: new Date().toISOString(), rating: 5 },
  ]);

  useEffect(() => {
    setProducts(prev => prev.map(p => ({
        ...p,
        stockCount: stocks.filter(s => s.productId === p.id && !s.isUsed).length
    })));
  }, [stocks]);

  const logActivity = (action: string, details: string, type: ActivityLog['type'] = 'info') => {
      const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          adminName: user?.name || 'System',
          action,
          details,
          date: new Date().toISOString(),
          type
      };
      setActivityLogs(prev => [newLog, ...prev]);
  };

  const sendNotification = (userId: string, title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
      const newNotif: Notification = {
          id: `notif-${Date.now()}-${Math.random()}`,
          userId,
          title,
          message,
          type,
          date: new Date().toISOString(),
          isRead: false
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotifications = () => {
      if(user) {
          setNotifications(prev => prev.filter(n => n.userId !== user.id));
      }
  };

  const login = (email: string, pass: string) => {
    const foundUser = usersList.find(u => u.email === email && u.password === pass);
    if (foundUser) {
      if (foundUser.isBanned) {
        alert("Hesabınız bloklanıb. Zəhmət olmasa dəstək xidməti ilə əlaqə saxlayın.");
        return false;
      }
      setUser(foundUser);
      logActivity('User Login', `${foundUser.email} daxil oldu.`);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, phone: string, pass: string) => {
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      balance: 0,
      password: pass,
      isBanned: false,
      wishlist: [],
      referralCode: referralCode,
      referralEarnings: 0,
      referralCount: 0
    };
    setUsersList(prev => [...prev, newUser]);
    setUser(newUser);
    sendNotification(newUser.id, 'Xoş Gəldiniz!', 'Platformamıza xoş gəldiniz. Uğurlu alış-verişlər!', 'success');
    logActivity('New Register', `${email} qeydiyyatdan keçdi.`, 'success');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    logActivity('Profile Update', `${user.email} profilini yenilədi.`);
  };

  const changePassword = (currentPass: string, newPass: string) => {
      if(!user) return false;
      if(user.password !== currentPass) return false;
      
      const updatedUser = { ...user, password: newPass };
      setUser(updatedUser);
      setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      logActivity('Password Change', `${user.email} şifrəsini dəyişdi.`);
      return true;
  };

  const requestPasswordReset = (phone: string) => {
    const exists = usersList.find(u => u.phone === phone);
    if (exists) {
      setUsersList(prev => prev.map(u => u.phone === phone ? { ...u, resetRequested: true } : u));
      return true; 
    }
    return false;
  };

  const generateResetLink = (userId: string) => {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, resetToken: token } : u));
      return `${window.location.origin}/#/auth?token=${token}`;
  };

  const confirmPasswordReset = (token: string, newPass: string) => {
      const userWithToken = usersList.find(u => u.resetToken === token);
      if(!userWithToken) return false;

      setUsersList(prev => prev.map(u => u.id === userWithToken.id ? { 
          ...u, 
          password: newPass, 
          resetToken: undefined, // Clear token
          resetRequested: false // Clear flag
      } : u));
      logActivity('Password Reset', `${userWithToken.email} şifrəsini token ilə yenilədi.`, 'warning');
      return true;
  };

  const adminUpdateUserPassword = (userId: string, newPass: string) => {
    const targetUser = usersList.find(u => u.id === userId);
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, password: newPass, resetRequested: false } : u));
    logActivity('Admin Password Change', `Admin ${targetUser?.email} istifadəçisinin şifrəsini dəyişdi.`, 'warning');
  };

  const toggleUserBan = (userId: string) => {
    const targetUser = usersList.find(u => u.id === userId);
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
    logActivity('User Ban/Unban', `Admin ${targetUser?.email} statusunu dəyişdi.`, 'warning');
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const updateUserBalance = (amount: number) => {
    if(user) {
        const newBalance = user.balance + amount;
        const updatedUser = { ...user, balance: newBalance };
        setUser(updatedUser);
        setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        logActivity('Balance Update', `${user.email} balansı ${amount > 0 ? '+' : ''}${amount} AZN dəyişdi.`);
    }
  };
  
  const toggleWishlist = (productId: string) => {
      if(!user) return;
      const currentWishlist = user.wishlist || [];
      let newWishlist;
      if(currentWishlist.includes(productId)) {
          newWishlist = currentWishlist.filter(id => id !== productId);
      } else {
          newWishlist = [...currentWishlist, productId];
      }
      const updatedUser = { ...user, wishlist: newWishlist };
      setUser(updatedUser);
      setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const addStock = (productId: string, codes: string[]) => {
      const newStocks = codes.map(code => ({
          id: `stock-${Date.now()}-${Math.random()}`,
          productId,
          code,
          isUsed: false,
          dateAdded: new Date().toISOString()
      }));
      setStocks(prev => [...prev, ...newStocks]);
      logActivity('Stock Added', `${codes.length} ədəd kod əlavə olundu.`);
  };

  const deleteStock = (stockId: string) => {
      setStocks(prev => prev.filter(s => s.id !== stockId));
      logActivity('Stock Deleted', `Stok ID ${stockId} silindi.`, 'warning');
  };

  const addToCart = (product: Product, userInput?: string) => {
    const finalPrice = product.price - (product.price * (product.discountPercent / 100));
    setCart(prev => {
        const existingIndex = prev.findIndex(item => item.productId === product.id && item.userInput === userInput);
        if (existingIndex > -1) {
            const newCart = [...prev];
            newCart[existingIndex].quantity += 1;
            return newCart;
        } else {
            return [...prev, {
                productId: product.id,
                title: product.title,
                price: finalPrice,
                image: product.image,
                type: product.type,
                userInput,
                quantity: 1,
                durationDays: product.durationDays,
                isLifetime: product.isLifetime
            }];
        }
    });
  };

  const updateCartQuantity = (index: number, delta: number) => {
      setCart(prev => {
          const newCart = [...prev];
          const item = newCart[index];
          const newQty = item.quantity + delta;
          if (newQty <= 0) return prev.filter((_, i) => i !== index);
          item.quantity = newQty;
          return newCart;
      });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (paymentMethodId: string | 'BALANCE', receiptFile?: File, promoDiscount: number = 0): Promise<boolean> => {
    if (!user || cart.length === 0) return false;
    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPrice = subTotal - promoDiscount;

    if (paymentMethodId === 'BALANCE') {
        if (user.balance < totalPrice) {
            alert("Balansınızda kifayət qədər vəsait yoxdur.");
            return false;
        }
        updateUserBalance(-totalPrice);
        const orderId = `ord-${Date.now()}`;
        let autoDeliveredContent = "";
        let isFullyDelivered = true;
        const updatedStocks = [...stocks];
        let maxDuration = 0;
        let isOrderLifetime = false;

        cart.forEach(item => {
             // Handle lifetime logic
            if (item.isLifetime) {
                isOrderLifetime = true;
            } else if (item.durationDays && item.durationDays > maxDuration) {
                maxDuration = item.durationDays;
            }

            if (item.type === ProductType.LICENSE_KEY || item.type === ProductType.ACCOUNT) {
                const available = updatedStocks.filter(s => s.productId === item.productId && !s.isUsed);
                if (available.length >= item.quantity) {
                     for(let i=0; i<item.quantity; i++) {
                         const stock = available[i];
                         stock.isUsed = true;
                         autoDeliveredContent += `${item.title}: ${stock.code}\n`;
                         const sIndex = updatedStocks.findIndex(s => s.id === stock.id);
                         updatedStocks[sIndex].isUsed = true;
                     }
                } else {
                    isFullyDelivered = false;
                    autoDeliveredContent += `${item.title}: (Stok bitib, Admin göndərəcək)\n`;
                }
            } else {
                 isFullyDelivered = false; 
                 autoDeliveredContent += `${item.title}: (Yükləmə Gözlənilir)\n`;
            }
        });
        
        setStocks(updatedStocks);
        const finalStatus = isFullyDelivered ? OrderStatus.COMPLETED : OrderStatus.PROCESSING;

        let expiryDate;
        if (!isOrderLifetime && maxDuration > 0) {
            const d = new Date();
            d.setDate(d.getDate() + maxDuration);
            expiryDate = d.toISOString();
        } 
        // If lifetime, expiryDate remains undefined

        const newOrder: Order = {
            id: orderId,
            userId: user.id,
            items: [...cart],
            totalPrice: totalPrice,
            discountApplied: promoDiscount,
            status: finalStatus,
            date: new Date().toISOString(),
            paymentMethodName: 'Wallet Balance',
            deliveredContent: autoDeliveredContent,
            productTitle: cart.length > 1 ? `${cart.length} Məhsul` : cart[0].title,
            productId: 'cart-checkout',
            price: totalPrice,
            productType: ProductType.LICENSE_KEY,
            expiryDate: expiryDate
        };
        
        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        sendNotification(user.id, "Sifariş Qəbul Edildi", `Sifarişiniz (#${newOrder.id.slice(-6)}) ${isFullyDelivered ? 'tamamlandı' : 'emal olunur'}.`, 'success');
        logActivity('Order Placed', `Order #${orderId} (Balance) - ${totalPrice} AZN`);
        return true;
    }

    const method = paymentMethods.find(p => p.id === paymentMethodId);
    if (!method || !receiptFile) return false;
    const receiptUrl = URL.createObjectURL(receiptFile);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: user.id,
      items: [...cart],
      totalPrice: totalPrice,
      discountApplied: promoDiscount,
      status: OrderStatus.PENDING,
      date: new Date().toISOString(),
      paymentMethodName: method.name,
      receiptImage: receiptUrl,
      productTitle: cart.length > 1 ? `${cart.length} Məhsul` : cart[0].title,
      productId: 'cart-checkout',
      price: totalPrice,
      productType: ProductType.LICENSE_KEY
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    sendNotification(user.id, "Sifariş Gözləmədə", `Sifarişiniz (#${newOrder.id.slice(-6)}) yoxlanışa göndərildi.`, 'info');
    logActivity('Order Placed', `Order #${newOrder.id} (Manual) - ${totalPrice} AZN`);
    return true;
  };

  const placeBalanceOrder = async (amount: number, paymentMethodId: string, receiptFile: File): Promise<boolean> => {
    if (!user) return false;
    const method = paymentMethods.find(p => p.id === paymentMethodId);
    if (!method) return false;
    const receiptUrl = URL.createObjectURL(receiptFile);

    const newOrder: Order = {
      id: `bal-${Date.now()}`,
      userId: user.id,
      items: [{
        productId: 'balance-topup',
        title: 'Balans Artımı',
        price: amount,
        image: 'https://via.placeholder.com/150',
        type: ProductType.BALANCE,
        quantity: 1
      }],
      totalPrice: amount,
      status: OrderStatus.PENDING,
      date: new Date().toISOString(),
      paymentMethodName: method.name,
      receiptImage: receiptUrl,
      productTitle: 'Balans Artımı',
      productType: ProductType.BALANCE,
      price: amount
    };

    setOrders(prev => [newOrder, ...prev]);
    sendNotification(user.id, "Balans Sorğusu", `${amount} AZN dəyərində balans artım sorğunuz qeydə alındı.`, 'info');
    logActivity('Balance Request', `User ${user.email} ${amount} AZN artım istədi.`);
    return true;
  };

  const processOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: OrderStatus.PROCESSING } : order));
    const order = orders.find(o => o.id === orderId);
    if(order) sendNotification(order.userId, "Sifariş Emalda", `Sifarişiniz (#${order.id.slice(-6)}) emal olunur.`, 'info');
    logActivity('Order Processing', `Order #${orderId} emala alındı.`);
  };

  const completeOrder = (orderId: string, manualContent?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      let finalContent = manualContent || order.deliveredContent || "";
      if (!manualContent && !order.items.some(i => i.type === ProductType.BALANCE)) {
           let updatedStocks = [...stocks];
           let autoGenerated = "";
           order.items.forEach(item => {
               if(item.type === ProductType.LICENSE_KEY || item.type === ProductType.ACCOUNT) {
                   const available = updatedStocks.filter(s => s.productId === item.productId && !s.isUsed);
                   if (available.length >= item.quantity) {
                        for(let i=0; i<item.quantity; i++) {
                             const stock = available[i];
                             const sIdx = updatedStocks.findIndex(s=>s.id === stock.id);
                             updatedStocks[sIdx].isUsed = true;
                             autoGenerated += `${item.title}: ${stock.code}\n`;
                        }
                   }
               }
           });
           if (autoGenerated) {
               setStocks(updatedStocks);
               finalContent = autoGenerated;
           }
      }
      sendNotification(order.userId, "Sifariş Tamamlandı!", `Sifarişiniz (#${order.id.slice(-6)}) təsdiqləndi.`, 'success');
      if (order.items.some(i => i.type === ProductType.BALANCE)) {
         updateUserBalance(order.totalPrice);
         sendNotification(order.userId, "Balans Artırıldı", `${order.totalPrice} AZN balansınıza əlavə olundu.`, 'success');
      }
      
      let expiryDate = order.expiryDate;
      // Recalculate expiry if not set
      if (!expiryDate && order.items.length >= 1) {
          if (order.items.some(i => i.isLifetime)) {
              expiryDate = undefined; // Lifetime
          } else if (order.items[0].durationDays) {
            const d = new Date();
            d.setDate(d.getDate() + order.items[0].durationDays);
            expiryDate = d.toISOString();
          }
      }
      logActivity('Order Completed', `Order #${orderId} tamamlandı.`, 'success');
      return { ...order, status: OrderStatus.COMPLETED, deliveredContent: finalContent, expiryDate: expiryDate };
    }));
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: OrderStatus.CANCELLED } : order));
    const order = orders.find(o => o.id === orderId);
    if(order) {
        sendNotification(order.userId, "Sifariş Ləğv Edildi", `Sifarişiniz (#${order.id.slice(-6)}) ləğv edildi.`, 'error');
        if (order.paymentMethodName === 'Wallet Balance') {
            updateUserBalance(order.totalPrice);
            sendNotification(order.userId, "Refund", `${order.totalPrice} AZN balansınıza qaytarıldı.`, 'success');
            logActivity('Order Refunded', `Order #${orderId} məbləği geri qaytarıldı.`);
        }
    }
    logActivity('Order Cancelled', `Order #${orderId} ləğv edildi.`, 'error');
  };

  const addProduct = (product: Product) => { setProducts(prev => [...prev, product]); logActivity('Product Added', product.title); }
  const addProducts = (newProducts: Product[]) => setProducts(prev => [...prev, ...newProducts]);
  const deleteProduct = (productId: string) => { setProducts(prev => prev.filter(p => p.id !== productId)); logActivity('Product Deleted', productId); }
  const addCategory = (category: Category) => { setCategories(prev => [...prev, category]); logActivity('Category Added', category.name); }
  const deleteCategory = (categoryId: string) => setCategories(prev => prev.filter(c => c.id !== categoryId));
  const updateSiteSettings = (settings: Partial<SiteSettings>) => { setSiteSettings(prev => ({ ...prev, ...settings })); logActivity('Settings Updated', 'Sayt ayarları dəyişdirildi.'); }
  const addPaymentMethod = (method: PaymentMethod) => setPaymentMethods(prev => [...prev, method]);
  const updatePaymentMethod = (id: string, details: Partial<PaymentMethod>) => setPaymentMethods(prev => prev.map(pm => pm.id === id ? { ...pm, ...details } : pm));
  const deletePaymentMethod = (id: string) => setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  const addPromoCode = (promo: PromoCode) => setPromoCodes(prev => [...prev, promo]);
  const deletePromoCode = (id: string) => setPromoCodes(prev => prev.filter(p => p.id !== id));
  const togglePromoCode = (id: string) => setPromoCodes(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  const addBlog = (blog: Blog) => setBlogs(prev => [...prev, blog]);
  const deleteBlog = (id: string) => setBlogs(prev => prev.filter(b => b.id !== id));
  const addAgreement = (agreement: Agreement) => setAgreements(prev => [...prev, agreement]);
  const deleteAgreement = (id: string) => setAgreements(prev => prev.filter(a => a.id !== id));
  const addComment = (newCommentData: Omit<Comment, 'id' | 'date' | 'isApproved'>) => {
      const newComment: Comment = {
          id: `cmt-${Date.now()}`,
          ...newCommentData,
          isApproved: true, 
          date: new Date().toISOString()
      };
      setComments(prev => [newComment, ...prev]);
      logActivity('New Comment', `${newCommentData.author} rəy yazdı: ${newComment.rating} ulduz.`);
  };
  const toggleCommentApproval = (id: string) => setComments(prev => prev.map(c => c.id === id ? {...c, isApproved: !c.isApproved} : c));
  const deleteComment = (id: string) => setComments(prev => prev.filter(c => c.id !== id));

  return (
    <AppContext.Provider value={{ 
      user, usersList, isAuthenticated: !!user,
      products, categories, orders, paymentMethods, promoCodes, siteSettings, cart, notifications,
      stocks, activityLogs,
      blogs, agreements, comments,
      login, register, logout, requestPasswordReset, updateUserProfile, adminUpdateUserPassword, toggleUserBan, generateResetLink, confirmPasswordReset, changePassword,
      addToCart, updateCartQuantity, removeFromCart, clearCart,
      placeOrder, placeBalanceOrder, processOrder, completeOrder, cancelOrder, updateUserBalance, markNotificationRead, clearNotifications,
      addPaymentMethod, updatePaymentMethod, deletePaymentMethod, addPromoCode, deletePromoCode, togglePromoCode,
      addProduct, addProducts, deleteProduct, addCategory, deleteCategory, updateSiteSettings,
      addBlog, deleteBlog, addAgreement, deleteAgreement, toggleCommentApproval, deleteComment, addComment,
      addStock, deleteStock, toggleWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};