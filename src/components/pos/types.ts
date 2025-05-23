export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  stock: number;
  description?: string;
  barcode?: string;
  variations?: ProductVariation[];
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variation?: ProductVariation;
  notes?: string;
}
