import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

 
const jwt_decode = require('jwt-decode');


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/api';  // Replace with your API URL
  private tokenKey = 'authToken';  // Key for storing the token in localStorage

  constructor(private http: HttpClient, private storageService: StorageService) {}

  login(username: string, password: string): Observable<any> {
    const credentials = { username, password };
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    this.storageService.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return this.storageService.getItem(this.tokenKey);
  }

  decodeToken(): any {
    const token = this.getToken();
    return token ? jwt_decode(token) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded: any = this.decodeToken();
    const expiryDate = decoded?.exp;
    const now = Math.floor(Date.now() / 1000);

    return expiryDate > now;
  }

  logout(): void {
    this.storageService.removeItem(this.tokenKey);
  }

}