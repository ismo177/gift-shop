// src/app/service/product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Product{
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/api/products'; 

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    
    addProduct(name: string, description:string, price: number, imageUrl: string): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, { name , description, price, imageUrl});
    }


    updateProduct(id: number, name: string, description: string, price:number, imageUrl:string): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, { name, description, price, imageUrl});
    }

  
    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    }

