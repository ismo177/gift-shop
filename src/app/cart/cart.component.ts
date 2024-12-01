// src/app/cart/cart.component.ts

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cartItems: any[] = [];

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCartItems();
    }

    private loadCartItems(): void {
        const cart = this.cartService.getItems();
        this.cartItems = [];

        cart.forEach(([productId, quantity]) => {
            this.productService.getProduct(parseInt(productId)).subscribe((product) => {
                this.cartItems.push({ product, quantity });
            });
        });
    }
    increaseQuantity(productId: string): void {
        this.cartService.addItem(productId);
        this.updateCart();
    }

    decreaseQuantity(productId: string): void {
        this.cartService.decreaseItem(productId);
        this.updateCart();
    }

    removeFromCart(productId: string): void {
        this.cartService.removeItem(productId);
        this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    }

    clearCart(): void {
        this.cartService.clearCart();
        this.cartItems = [];
    }

    get items(): any[] {
        return this.cartService.getItems();
    }

    totalCost(): number {
        return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    checkout(): void {
        this.router.navigate(['/checkout']);
    }

    hasItems(): boolean {
        return this.cartItems.length > 0;
    }
    private updateCart(): void {
        const cart = this.cartService.getItems();
        this.cartItems = [];
        cart.forEach(([productId, quantity]) => {
            this.productService.getProduct(parseInt(productId)).subscribe((product) => {
                this.cartItems.push({ product, quantity });
            });
        });
    }
}

