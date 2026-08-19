import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail.component',
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {

// Angular mapea automáticamente :id de la ruta a este Signal input
  id = input.required<string>();

  // httpResource detecta cuando id() cambia y realiza la consulta automáticamente
  productResource = httpResource<Product>(() => 
    `https://fakestoreapi.com/products/${this.id()}`
  );
}
