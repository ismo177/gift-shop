// src/app/checkout/checkout.component.ts

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    cartItems: any[] = [];
    total: number = 0;
    checkoutForm: FormGroup;

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private router: Router,
        private fb: FormBuilder,
    ) {
        this.checkoutForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]],
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadCartItems();
    }

    private loadCartItems(): void {
        const cart = this.cartService.getItems();
        this.cartItems = [];

        cart.forEach(([productId, quantity]) => {
            this.productService.getProduct(parseInt(productId)).subscribe((product) => {
                this.cartItems.push({ product, quantity });
                this.total += product.price * quantity;
            });
        });
    }

    increaseQuantity(event:Event,productId: string): void {
        event.preventDefault();
        this.cartService.addItem(productId);
        this.updateCart();
    }

    decreaseQuantity(event: Event,productId: string): void {
        event.preventDefault();
        this.cartService.decreaseItem(productId);
        this.updateCart();
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

    totalCost(): number {
        return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    onSubmit(event:Event) {
        event.preventDefault();
        if (this.checkoutForm.valid) {
            // Handle successful form submission
            console.log('Form Submitted', this.checkoutForm.value);
            // Clear cart and redirect to home
            this.cartService.clearCart();
            this.cartItems = [];
            this.total = 0;
            alert('Checkout complete. Thank you for your purchase!');

            this.router.navigate(['/']);
        } else {
            // Handle form validation errors
            console.log('Form is invalid');
            alert("Form data is invalid");
        }
    }

    checkout(): void {
        // Placeholder for potential checkout logic
    }
}

