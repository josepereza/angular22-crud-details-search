import { Routes } from '@angular/router';

export const routes: Routes = [
    // Ruta por defecto: redirige a la lista de productos
  { 
    path: '', 
    redirectTo: 'products', 
    pathMatch: 'full' 
  },
  
  // Ruta principal: Lista de productos (con Lazy Loading)
  { 
    path: 'products', 
    loadComponent: () => 
      import('./components/product-list.component/product-list.component')
        .then(m => m.ProductListComponent) 
  },
  
  // Ruta de detalle: Carga la información de un producto por ID
  { 
    path: 'products/:id', 
    loadComponent: () => 
      import('./components/product-detail.component/product-detail.component')
        .then(m => m.ProductDetailComponent) 
  },
  
  // Comodín: redirige cualquier ruta no encontrada a la lista
  { 
    path: '**', 
    redirectTo: 'products' 
  }
];
