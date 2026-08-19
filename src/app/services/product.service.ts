import { Service } from '@angular/core';
import { Injectable, signal,  inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http'; // ✅
import { CreateProductDto, Product } from '../models/product.model';
@Service()
export class ProductService {
    private http = inject(HttpClient);
  private readonly apiUrl = 'https://fakestoreapi.com/products';

  // Signals para los filtros
  selectedCategory = signal<string>('');
  searchTerm = signal<string>(''); // <-- Nuevo Signal para el buscador

  // Resource base que obtiene los productos por categoría
  private baseProductsResource = httpResource<Product[]>(() => {
    const category = this.selectedCategory();
    return category 
      ? `${this.apiUrl}/category/${category}`
      : this.apiUrl;
  });

  // Signal computado que filtra localmente por título en tiempo real
  products = computed(() => {
    const list = this.baseProductsResource.value() ?? [];
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return list;

    return list.filter(p => p.title.toLowerCase().includes(term));
  });

  // Exponemos los estados de carga y error del recurso base
  isLoading = this.baseProductsResource.isLoading;
  error = this.baseProductsResource.error;

  reload() {
    this.baseProductsResource.reload();
  }

  // Operaciones CRUD
  createProduct(product: CreateProductDto) {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<CreateProductDto>) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }
}
