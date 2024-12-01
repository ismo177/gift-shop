// src/app/product-detail/product-detail.component.ts

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import {
    RouterModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        RouterLink,
        RouterLinkActive,
      
    ],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
    product!: Product;
    isInCart: boolean = false;
    message: string='';
    

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        
    ) { 
        
    }

    ngOnInit(): void {
    //const productId =this.route.snapshot.paramMap.get('id');
    const productId = Number(this.route.snapshot.paramMap.get('id'));
        if (productId) {
            this.productService.getProduct(productId).subscribe((product) => {
                this.product = product;
                this.isInCart = this.cartService.isInCart(productId+"");
            });
        }
    }

    addToCart(): void {
        if (this.product) {
            alert(this.product.name);
            this.cartService.addItem(this.product.id+"");
            this.isInCart = true;
        }
    }
}

