import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Set an item in localStorage
  setItem(key: string, value: string): void {
    if (this.isBrowser()&& typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }

  // Get an item from localStorage
  getItem(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  // Remove an item from localStorage
  removeItem(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  // Clear all items in localStorage
  clear(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }

  // Check if the current platform is the browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
