import { supabase } from '@/integrations/supabase/client';

export type PaymentMethod = 'toss' | 'naver' | 'kakao';

export interface PaymentProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
}

export interface UserCredits {
  id: string;
  userId: string;
  credits: number;
  expiresAt: Date;
}

export const PAYMENT_PRODUCTS: PaymentProduct[] = [
  {
    id: 'basic',
    name: '기본 상담',
    description: '10회 상담 이용권',
    price: 10000,
    credits: 10
  },
  {
    id: 'premium',
    name: '프리미엄 상담',
    description: '30회 상담 이용권 + 상세 분석 리포트',
    price: 25000,
    credits: 30
  },
  {
    id: 'unlimited',
    name: '무제한 상담',
    description: '30일 동안 무제한 상담 + 모든 기능 이용',
    price: 50000,
    credits: 999999
  }
];

export const getUserCredits = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return 0;
    }

    return data.credits;
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return 0;
  }
};

export const deductCredits = async (userId: string, amount: number = 1): Promise<boolean> => {
  try {
    const currentCredits = await getUserCredits(userId);
    
    if (currentCredits < amount) {
      return false;
    }

    const { error } = await supabase
      .from('user_credits')
      .update({ 
        credits: currentCredits - amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    return !error;
  } catch (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
};

export const addCredits = async (
  userId: string, 
  credits: number, 
  expiresInDays: number = 30
): Promise<boolean> => {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { error } = await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        credits,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    return !error;
  } catch (error) {
    console.error('Error adding credits:', error);
    return false;
  }
};

export const processPayment = async (
  userId: string,
  product: PaymentProduct,
  method: PaymentMethod
): Promise<{ success: boolean; message: string; redirectUrl?: string }> => {
  try {
    let paymentUrl: string;
    const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const successUrl = `${window.location.origin}/payment/success`;
    const failUrl = `${window.location.origin}/payment/fail`;

    switch (method) {
      case 'toss':
        // 토스페이먼츠 결제 요청
        paymentUrl = `https://pay.toss.im/api/v2/payments?orderId=${orderId}&amount=${product.price}&orderName=${encodeURIComponent(product.name)}&successUrl=${encodeURIComponent(successUrl)}&failUrl=${encodeURIComponent(failUrl)}`;
        break;

      case 'naver':
        // 네이버페이 결제 요청
        paymentUrl = `https://dev.apis.naver.com/naverpay/payments/v2/payment-auth?orderId=${orderId}&amount=${product.price}&productName=${encodeURIComponent(product.name)}&returnUrl=${encodeURIComponent(successUrl)}`;
        break;

      case 'kakao':
        // 카카오페이 결제 요청
        paymentUrl = `https://kapi.kakao.com/v1/payment/ready?cid=TC0ONETIME&partner_order_id=${orderId}&partner_user_id=${userId}&item_name=${encodeURIComponent(product.name)}&quantity=1&total_amount=${product.price}&approval_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(failUrl)}&fail_url=${encodeURIComponent(failUrl)}`;
        break;

      default:
        throw new Error('지원하지 않는 결제 수단입니다.');
    }

    // 결제 정보를 DB에 저장
    const { error } = await supabase
      .from('payment_requests')
      .insert({
        user_id: userId,
        order_id: orderId,
        product_id: product.id,
        amount: product.price,
        payment_method: method,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: '결제 페이지로 이동합니다.',
      redirectUrl: paymentUrl
    };

  } catch (error) {
    console.error('Error initiating payment:', error);
    return {
      success: false,
      message: '결제 처리 중 오류가 발생했습니다.'
    };
  }
};

export const handlePaymentSuccess = async (
  orderId: string,
  paymentKey?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // 결제 요청 정보 조회
    const { data: paymentRequest, error: fetchError } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (fetchError || !paymentRequest) {
      throw new Error('결제 정보를 찾을 수 없습니다.');
    }

    // 결제 상태 업데이트
    const { error: updateError } = await supabase
      .from('payment_requests')
      .update({
        status: 'completed',
        payment_key: paymentKey,
        completed_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (updateError) {
      throw updateError;
    }

    // 크레딧 추가
    const product = PAYMENT_PRODUCTS.find(p => p.id === paymentRequest.product_id);
    if (!product) {
      throw new Error('상품 정보를 찾을 수 없습니다.');
    }

    const addedCredits = await addCredits(
      paymentRequest.user_id,
      product.credits,
      product.id === 'unlimited' ? 30 : 365
    );

    if (!addedCredits) {
      throw new Error('크레딧 추가에 실패했습니다.');
    }

    return {
      success: true,
      message: '결제가 완료되었습니다.'
    };

  } catch (error) {
    console.error('Error processing payment success:', error);
    return {
      success: false,
      message: '결제 처리 중 오류가 발생했습니다.'
    };
  }
}; 