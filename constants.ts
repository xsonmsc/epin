import { Product, ProductType, PaymentMethod, User, Category, SiteSettings, PromoCode } from './types';

// Default Admin User
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Rəşad Məmmədov',
    email: 'user@digistore.az',
    phone: '0501234567',
    role: 'user', 
    balance: 0.00,
    password: 'password123',
    avatar: '',
    isBanned: false,
    referralCode: 'USER01'
  },
  {
    id: 'admin1',
    name: 'Admin',
    email: 'admin@digistore.az',
    phone: '0555555555',
    role: 'admin',
    balance: 0.00,
    password: 'admin',
    avatar: '',
    isBanned: false
  }
];

export const MOCK_PROMO_CODES: PromoCode[] = [
  { id: 'promo1', code: 'DIGI10', discountPercent: 10, isActive: true },
  { id: 'promo2', code: 'START', discountPercent: 15, isActive: true }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'DigiStore',
  logoUrl: '', 
  heroBannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop', // Tech/Office background
  heroTitle: 'Rəqəmsal İmkanları Kəşf Edin',
  heroSubtitle: 'AI alətləri, Dizayn proqramları və Lisenziyaların rəsmi satış platforması.',
  whatsappNumber: '+994555555555',
  contactEmail: 'info@digistore.az',
  contactAddress: 'Bakı şəhəri, Port Baku Tower',
  footerText: '© 2024 DigiStore Azerbaijan. Rəsmi lisenziyalı proqram təminatı.',
  discordWebhook: '',
  seoTitle: 'DigiStore AZ - Lisenziyalar və AI Hesabları',
  seoDesc: 'Azərbaycanın ən böyük rəqəmsal lisenziya platforması.',
  socials: {
    instagram: 'https://instagram.com',
    telegram: 'https://t.me',
    tiktok: '',
    whatsapp: 'https://wa.me/994555555555'
  }
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_ai', name: 'Süni İntellekt (AI)', icon: 'bot', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop' },
  { id: 'cat_design', name: 'Dizayn & Yaradıcılıq', icon: 'palette', image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=1000&auto=format&fit=crop' },
  { id: 'cat_office', name: 'Ofis & Təhsil', icon: 'briefcase', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop' },
  { id: 'cat_stream', name: 'Film & Musiqi', icon: 'play', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'ChatGPT Plus (4.0) - Fərdi',
    categoryId: 'cat_ai',
    type: ProductType.ACCOUNT,
    price: 35.00,
    costPrice: 30.00,
    discountPercent: 0,
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    description: 'Şəxsi hesabınıza aktivləşdirmə. DALL-E 3 və GPT-4o daxildir. 1 Aylıq abunə.',
    requiresInput: true,
    inputLabel: 'OpenAI Email ünvanı',
    durationDays: 30
  },
  {
    id: 'p2',
    title: 'Canva Pro - Ömürlük',
    categoryId: 'cat_design',
    type: ProductType.ACCOUNT,
    price: 15.00,
    costPrice: 5.00,
    discountPercent: 0, 
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    description: 'Şəxsi emailinizə komanda dəvəti ilə qoşulma. Bütün Premium şablonlar aktivdir.',
    requiresInput: true,
    inputLabel: 'Canva Email ünvanı',
    isLifetime: true // Lifetime product
  },
  {
    id: 'p3',
    title: 'Microsoft Office 365 (5 Cihaz)',
    categoryId: 'cat_office',
    type: ProductType.ACCOUNT,
    price: 12.00,
    costPrice: 3.00,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
    description: 'Word, Excel, PowerPoint. PC, Mac və Mobil dəstəkləyir. 1 TB OneDrive daxildir.',
    durationDays: 365
  },
  {
    id: 'p4',
    title: 'CapCut Pro - 1 İllik',
    categoryId: 'cat_design',
    type: ProductType.ACCOUNT,
    price: 25.00,
    costPrice: 15.00,
    discountPercent: 10,
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop',
    description: 'Video montaj üçün premium alətlər. Reklamsız.',
    durationDays: 365
  },
  {
    id: 'p5',
    title: 'Windows 11 Pro Lisenziya',
    categoryId: 'cat_office',
    type: ProductType.LICENSE_KEY,
    price: 20.00,
    costPrice: 8.00,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop',
    description: 'Rəsmi Retail açar. Formatdan sonra istifadə edilə bilər. Ömürlük aktivasiya.',
    isLifetime: true
  },
  {
    id: 'p6',
    title: 'Gemini Advanced',
    categoryId: 'cat_ai',
    type: ProductType.ACCOUNT,
    price: 38.00,
    costPrice: 35.00,
    discountPercent: 0,
    image: 'https://lh3.googleusercontent.com/Xk_s5S7y_b2XqZ7Y7Y5c8f8Z7Y7Y5c8f8Z7Y7Y5c8f8Z7Y7Y5c8f8Z7Y7Y5c8f8=w2400', // Simplified link or generic AI
    description: 'Google-un ən güclü AI modeli. Google One Premium daxildir.',
    requiresInput: true,
    inputLabel: 'Gmail ünvanı',
    durationDays: 30
  }
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm1',
    name: 'Birbank (Kartdan-karta)',
    details: '4169 0000 0000 0000 (Rəşad M.)',
    instructions: 'Ödəniş edərkən rəy bölməsinə heç nə yazmayın.',
    isActive: true,
    icon: 'credit-card'
  },
  {
    id: 'pm2',
    name: 'M10 / MilliÖn',
    details: '055 555 55 55',
    instructions: 'M10 pul kisəsinə köçürmə edin və qəbzi yükləyin.',
    isActive: true,
    icon: 'smartphone'
  }
];