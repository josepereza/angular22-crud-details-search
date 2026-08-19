import { Component, inject, input, output, signal, OnInit } from '@angular/core';
// Importaciones de Signal Forms
import { form, FormField, required, min, debounce } from '@angular/forms/signals';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
@Component({
  selector: 'app-product-form',
  imports: [FormField],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {

  private productService = inject(ProductService);

  productToEdit = input<Product | null>(null);
  closeModal = output<void>();

  // 1. Modelo de datos en un Signal fuente
  productModel = signal({
    title: '',
    price: 0,
    category: 'electronics',
    description: ''
  });

  // 2. Creación del formulario usando la función form() y su esquema
  productForm = form(this.productModel, (s) => {
    required(s.title, { message: 'El título es obligatorio' });
    debounce(s.title, 250);

    required(s.price);
    min(s.price, 0.01, { message: 'El precio debe ser mayor a 0' });

    required(s.category);
  });

  ngOnInit() {
    const product = this.productToEdit();
    if (product) {
      // Para cargar valores en Signal Forms actualizamos el Signal fuente
      this.productModel.set({
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description
      });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    // Comprobación de validez llamando al formulario como Signal: productForm()
    if (this.productForm().invalid()) return;

    // Los datos del formulario provienen directamente del Signal fuente
    const formValues = this.productModel();
    const productData = {
      title: formValues.title,
      price: Number(formValues.price),
      category: formValues.category,
      description: formValues.description
    };

    const currentProduct = this.productToEdit();

    if (currentProduct) {
      this.productService.updateProduct(currentProduct.id, productData).subscribe({
        next: () => {
          this.productService.reload();
          this.closeModal.emit();
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.productService.reload();
          this.closeModal.emit();
        }
      });
    }
  }
}
