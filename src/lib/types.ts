export interface Product {
  _id: string;
  name: string;
  price: number;
}

export interface CartItem {
  _id?: string;
  product: Product;
  qty: number;
}

export interface CheckoutReceipt {
  total: number;
  timestamp: string;
}
