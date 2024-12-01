// src/app/product-list/product-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../services/product.service';
import {
    RouterModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ActivatedRoute,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    //RouterOutlet,
    RouterLink
    
],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
    products: Product[]=[];
    filteredProducts: Product[] = [];
    searchQuery: string = '';
    sortCriteria: string = 'name';
    
    

    constructor(private productService: ProductService, private loginService: LoginService, private router: Router) { }

    ngOnInit(): void {
        this.productService.getProducts().subscribe((products) => {
            this.products = products;
            this.filteredProducts = products;
        });

        
        }
    

    searchProducts(): void {
        this.filteredProducts = this.products.filter((product) =>
            product.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    sortProducts(): void {
        if (this.sortCriteria === 'name') {
            this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.sortCriteria === 'priceAsc') {
            this.filteredProducts.sort((a, b) => a.price - b.price);
        } else if (this.sortCriteria === 'priceDesc') {
            this.filteredProducts.sort((a, b) => b.price - a.price);
            this.filteredProducts.forEach(element => {alert(element.name)
                
            });
        }
    }

    logout(): void {
        this.loginService.logout();
        this.router.navigate(['/login']);
      }
}

