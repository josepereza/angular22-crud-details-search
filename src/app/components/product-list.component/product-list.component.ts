import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../product-form.component/product-form.component';

@Component({
  selector: 'app-product-list.component',
imports: [ProductFormComponent, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {

  productService = inject(ProductService);

  showFormModal = signal(false);
  selectedProduct = signal<Product | null>(null);

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.productService.searchTerm.set(value);
  }

  clearSearch() {
    this.productService.searchTerm.set('');
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.productService.selectedCategory.set(value);
  }

  openCreateModal() {
    this.selectedProduct.set(null);
    this.showFormModal.set(true);
  }

  openEditModal(product: Product) {
    this.selectedProduct.set(product);
    this.showFormModal.set(true);
  }

  closeFormModal() {
    this.showFormModal.set(false);
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.productService.reload();
        }
      });
    }}
}
