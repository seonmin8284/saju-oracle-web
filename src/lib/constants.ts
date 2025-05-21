export type PaymentProduct = {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
};

export const PAYMENT_PRODUCTS: Record<string, PaymentProduct> = {
  BASIC: {
    id: 'basic',
    name: '기본 상담',
    credits: 10,
    price: 10000,
    description: '10회 상담 이용권'
  },
  PREMIUM: {
    id: 'premium',
    name: '프리미엄 상담',
    credits: 30,
    price: 25000,
    description: '30회 상담 이용권'
  },
  UNLIMITED: {
    id: 'unlimited',
    name: '무제한 상담',
    credits: -1,
    price: 50000,
    description: '30일 무제한 이용권'
  }
}; 