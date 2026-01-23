
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
  siteName: 'S2GEPIN',
  logoUrl: '', 
  heroBannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', 
  heroTitle: 'Oyun Dünyasına Xoş Gəldiniz',
  heroSubtitle: 'Ən sərfəli qiymətə UC, VP və E-pin satışı.',
  whatsappNumber: '+994555555555',
  contactEmail: 'info@s2gepin.az',
  contactAddress: 'Bakı şəhəri, Nizami küçəsi',
  footerText: '© 2024 S2GEPIN Azerbaijan. Bütün hüquqlar qorunur.',
  discordWebhook: '',
  seoTitle: 'S2GEPIN - PUBG UC, Valorant VP, Oyun Satışı',
  seoDesc: 'Azərbaycanın ən böyük oyun və epin platforması.',
  socials: {
    instagram: 'https://instagram.com',
    telegram: 'https://t.me',
    tiktok: '',
    whatsapp: 'https://wa.me/994555555555'
  }
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_pubg', name: 'PUBG Mobile', icon: 'crosshair', image: 'https://wallpapers.com/images/hd/pubg-mobile-poster-j688p340057041a7.jpg' },
  { id: 'cat_valorant', name: 'Valorant', icon: 'shield', image: 'https://images.hdqwalls.com/wallpapers/valorant-4k-gaming-new-2020-ix.jpg' },
  { id: 'cat_mlbb', name: 'Mobile Legends', icon: 'sword', image: 'https://images6.alphacoders.com/110/1107530.jpg' },
  { id: 'cat_steam', name: 'Steam Wallet', icon: 'wallet', image: 'https://steamcdn-a.akamaihd.net/steam/clusters/frontpage/88d697841551062080352528/page_bg_english.jpg' },
  { id: 'cat_lol', name: 'League of Legends', icon: 'gamepad', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg' },
  { id: 'cat_freefire', name: 'Free Fire', icon: 'flame', image: 'https://images.hdqwalls.com/wallpapers/garena-free-fire-4k-oa.jpg' },
  { id: 'cat_wolfteam', name: 'Wolfteam', icon: 'skull', image: 'https://i.ytimg.com/vi/S7QzK1yW4SE/maxresdefault.jpg' },
  { id: 'cat_apple', name: 'Apple iTunes', icon: 'smartphone', image: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?q=80&w=2074&auto=format&fit=crop' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // PUBG Products
  {
    id: 'pubg_60',
    title: '60 UC',
    categoryId: 'cat_pubg',
    type: ProductType.ID_LOAD,
    price: 1.70,
    costPrice: 1.50,
    discountPercent: 0,
    image: 'https://static.vecteezy.com/system/resources/previews/024/669/489/original/pubg-mobile-uc-60-currency-png.png',
    description: 'PUBG Mobile 60 UC. ID ilə yükləmə.',
    requiresInput: true,
    inputLabel: 'PUBG ID (Global)',
    durationDays: 0,
    stockCount: 999
  },
  {
    id: 'pubg_325',
    title: '325 + 25 UC',
    categoryId: 'cat_pubg',
    type: ProductType.ID_LOAD,
    price: 9.20,
    costPrice: 8.50,
    discountPercent: 5,
    image: 'https://static.vecteezy.com/system/resources/previews/024/669/482/original/pubg-mobile-uc-300-currency-png.png',
    description: 'PUBG Mobile 325 UC + Bonus. ID ilə yükləmə.',
    requiresInput: true,
    inputLabel: 'PUBG ID (Global)',
    durationDays: 0,
    stockCount: 999
  },
  {
    id: 'pubg_660',
    title: '660 + 60 UC',
    categoryId: 'cat_pubg',
    type: ProductType.ID_LOAD,
    price: 18.50,
    costPrice: 16.00,
    discountPercent: 0,
    image: 'https://static.vecteezy.com/system/resources/previews/024/669/485/original/pubg-mobile-uc-600-currency-png.png',
    description: 'PUBG Mobile 660 UC + Bonus. ID ilə yükləmə.',
    requiresInput: true,
    inputLabel: 'PUBG ID (Global)',
    durationDays: 0,
    stockCount: 999
  },
  {
    id: 'pubg_1800',
    title: '1800 UC',
    categoryId: 'cat_pubg',
    type: ProductType.ID_LOAD,
    price: 45.00,
    costPrice: 40.00,
    discountPercent: 0,
    image: 'https://static.vecteezy.com/system/resources/previews/024/669/493/original/pubg-mobile-uc-1500-currency-png.png',
    description: 'PUBG Mobile 1800 UC. ID ilə yükləmə.',
    requiresInput: true,
    inputLabel: 'PUBG ID (Global)',
    durationDays: 0,
    stockCount: 100
  },
  
  // Valorant Products
  {
    id: 'val_115',
    title: '115 VP (TR)',
    categoryId: 'cat_valorant',
    type: ProductType.LICENSE_KEY,
    price: 2.50,
    costPrice: 2.00,
    discountPercent: 0,
    image: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0f822108740c0649/5fd7f798e9b63b276d337f71/Valorant_2020_06_115_VP.png',
    description: 'Valorant 115 Points - Türkiyə Regionu üçün.',
    isLifetime: true,
    stockCount: 50
  },
  {
    id: 'val_485',
    title: '485 VP (TR)',
    categoryId: 'cat_valorant',
    type: ProductType.LICENSE_KEY,
    price: 10.50,
    costPrice: 9.00,
    discountPercent: 0,
    image: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt7274094a8f307398/5fd7f7981b212f2775a61e0e/Valorant_2020_06_485_VP.png',
    description: 'Valorant 485 Points - Türkiyə Regionu üçün.',
    isLifetime: true,
    stockCount: 25
  },
  {
    id: 'val_925',
    title: '925 VP (TR)',
    categoryId: 'cat_valorant',
    type: ProductType.LICENSE_KEY,
    price: 19.00,
    costPrice: 17.00,
    discountPercent: 0,
    image: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt904976c6691459a9/5fd7f798e1694027725916a0/Valorant_2020_06_925_VP.png',
    description: 'Valorant 925 Points - Türkiyə Regionu üçün.',
    isLifetime: true,
    stockCount: 20
  },
  {
    id: 'val_1850',
    title: '1850 VP (TR)',
    categoryId: 'cat_valorant',
    type: ProductType.LICENSE_KEY,
    price: 36.00,
    costPrice: 32.00,
    discountPercent: 10,
    image: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3f1246c310b994cc/5fd7f7980335272379b3d584/Valorant_2020_06_1850_VP.png',
    description: 'Valorant 1850 Points - Türkiyə Regionu üçün.',
    isLifetime: true,
    stockCount: 15
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
