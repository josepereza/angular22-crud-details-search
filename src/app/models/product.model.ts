// src/app/models/product.model.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image?: string; // <-- Propiedad añadida
}

export type CreateProductDto = Omit<Product, 'id'>;