// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Authenticated API request function
async function authenticatedApiRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return await response.json();
}

// Razorpay payment interfaces
export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface PaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Payment API service
export const paymentApi = {
  createOrder: async (amount: number, token: string, registrationData: any) => {
    const response = await authenticatedApiRequest(
      "/payment/create-order",
      token,
      {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: `TF2025_${Date.now()}`,
          notes: {
            registrationType: "tech-fiesta-2025",
            eventCount: 
              (registrationData.selectedEvents?.length || 0) +
              (registrationData.selectedWorkshops?.length || 0) +
              (registrationData.selectedNonTechEvents?.length || 0),
          },
          registrationData, // Store full registration data for webhook processing
        }),
      }
    );
    return response;
  },

  verifyPayment: async (
    paymentResponse: PaymentResponse,
    token: string,
    registrationData: any
  ) => {
    const response = await authenticatedApiRequest(
      "/payment/verify-payment",
      token,
      {
        method: "POST",
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          registrationData,
        }),
      }
    );
    return response;
  },

  // Check if payment was processed by webhook
  checkWebhookStatus: async (orderId: string, token: string) => {
    const response = await authenticatedApiRequest(
      `/payment/status/${orderId}`,
      token
    );
    return response;
  },

  // Poll for webhook completion
  pollPaymentStatus: async (orderId: string, token: string, maxAttempts: number = 10): Promise<any> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await authenticatedApiRequest(
          `/payment/status/${orderId}`,
          token
        );
        
        if (response.data.status === 'completed' && response.data.registrationId) {
          return response;
        }
        
        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Polling attempt ${attempt} failed:`, error);
        if (attempt === maxAttempts) {
          throw error;
        }
      }
    }
    
    throw new Error('Payment status polling timeout');
  },

  getPaymentStatus: async (orderId: string, token: string) => {
    const response = await authenticatedApiRequest(
      `/payment/status/${orderId}`,
      token
    );
    return response;
  },
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
