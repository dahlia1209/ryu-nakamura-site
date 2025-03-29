// Models for the checkout API

export interface CheckoutItem {
    name: string;
    price: number;
    quantity: number;
    description?: string;
    images?: string[];
  }
  
  export interface CheckoutSession {
    items: CheckoutItem[];
    success_url: string;
    cancel_url: string;
    order_id?: string;
    customer_id?: string;
    customer_email?: string;
    locale?: string;
    collect_shipping_address?: boolean;
    metadata?: Record<string, unknown>;
  }
  
  export interface CheckoutResponse {
    session_id: string;
    url: string;
  }