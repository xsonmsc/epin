
export enum ProductType {
  ID_LOAD = 'ID_LOAD',       
  LICENSE_KEY = 'LICENSE_KEY', 
  ACCOUNT = 'ACCOUNT',
  BALANCE = 'BALANCE'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  desc: string;
  btnText: string;
  link: string;
}

export interface StockCode {
  id: string;
  productId: string;
  code: string;
  isUsed: boolean;
  dateAdded: string;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  date: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  date: string;
  isRead: boolean;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  icon?: string;
  isPopular?: boolean; // New field for Game World section
  seoTitle?: string;
  seoKeywords?: string;
}

export interface Product {
  id: string;
  title: string;
  categoryId: string;
  subCategory?: string; // New: Alt Kateqoriya (Netflix -> UHD, HD)
  type: ProductType;
  price: number;        
  costPrice: number;    
  discountPercent: number; 
  image: string;
  description: string;
  requiresInput?: boolean;
  inputLabel?: string;
  seoTitle?: string;
  seoKeywords?: string;
  durationDays?: number;
  isLifetime?: boolean; 
  stockCount?: number;
  isPopular?: boolean; // New field for Popular Products section
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  type: ProductType;
  userInput?: string;
  quantity: number;
  durationDays?: number;
  isLifetime?: boolean;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
}

export interface Agreement {
  id: string;
  title: string; 
  content: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  type: 'product' | 'blog' | 'site';
  targetId?: string; 
  isApproved: boolean;
  date: string;
  rating?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  details: string; 
  instructions: string;
  isActive: boolean;
  icon: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  discountApplied?: number;
  status: OrderStatus;
  date: string;
  paymentMethodName: string;
  receiptImage?: string; 
  deliveredContent?: string;
  expiryDate?: string;
  
  productTitle?: string;
  productType?: ProductType;
  userInput?: string; 
  productId?: string;
  price?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  balance: number;
  password?: string;
  avatar?: string;
  resetRequested?: boolean;
  isBanned?: boolean;
  resetToken?: string;
  wishlist?: string[];
  
  // Extended Profile Info
  bio?: string;
  discordId?: string;
  steamId?: string;

  // Referral System
  referralCode?: string;
  referredBy?: string;
  referralEarnings?: number;
  referralCount?: number;
}

export interface SocialLinks {
  instagram: string;
  telegram: string;
  tiktok: string;
  whatsapp: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  heroBannerUrl: string; // Deprecated in favor of HeroSlide, keeping for compatibility
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  footerText: string;
  discordWebhook: string;
  seoTitle: string;
  seoDesc: string;
  contactEmail?: string;
  contactAddress?: string;
  socials: SocialLinks;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
}
