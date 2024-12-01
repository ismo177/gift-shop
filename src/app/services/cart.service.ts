// src/service/cart.service.ts

import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';



@Injectable({
    providedIn: 'root',
})
export class CartService {
    private items: BehaviorSubject<Map<string, number>>;
    
    constructor(private storageService:StorageService){
      this.items = new BehaviorSubject<Map<string, number>>(this.loadCart());
    }

    private loadCart(): Map<string, number> {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cart = this.storageService.getItem('cart');
        return cart ? new Map(JSON.parse(cart)) : new Map();
      } else {
        return new Map();
      }
    }

    private saveCart(): void {
       this.storageService.setItem( 'cart', JSON.stringify(Array.from(this.items.getValue().entries())) );
    }
  

    addItem(productId: string): void {
        const currentItems = this.items.getValue();
        if (currentItems.has(productId)) {
            currentItems.set(productId, currentItems.get(productId)! + 1);
        } else {
            currentItems.set(productId, 1);
        }
        this.items.next(currentItems);
        this.saveCart();
    }

    decreaseItem(productId: string): void {
        const currentItems = this.items.getValue();
        if (currentItems.has(productId) && currentItems.get(productId)! > 1) {
            currentItems.set(productId, currentItems.get(productId)! - 1);
        }
        this.items.next(currentItems);
        this.saveCart();
    }

    getCartItemCount(): number {
        let count = 0;
        this.items.getValue().forEach((quantity) => (count += quantity));
        return count;
    }

    getCartItemsObservable() {
        return this.items.asObservable();
    }

    getItems(): [string, number][] {
        return Array.from(this.items.getValue().entries());
    }

    removeItem(productId: string): void {
        const currentItems = this.items.getValue();
        if (currentItems.has(productId)) {
            currentItems.delete(productId);
        }
        this.items.next(currentItems);
        this.saveCart();
    }

    clearCart(): void {
        this.items.next(new Map());
        this.saveCart();
    }

    isInCart(productId: string): boolean {
        return this.items.getValue().has(productId);
    }
}

