import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message.service';
import { LoginService } from '../login.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive, FormsModule, NgClass, NgIf, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cartItemCount: number = 0;
  message: string='';
  isLoggedIn: boolean=false;


  constructor(public cartService: CartService, private messageService: MessageService, private loginService: LoginService, private router: Router) { 
    this.isLoggedIn=this.loggedIn();
  }

  ngOnInit(): void {
      this.cartService.getCartItemsObservable().subscribe(items => {
          this.cartItemCount = Array.from(items.values()).reduce((sum, quantity) => sum + quantity, 0);
      });
      //If using message service to get message from another component
      this.messageService.currentMessage.subscribe(message => {
        this.message = message;  
      });
      
  }

  getCartLink(): string {
    return this.cartItemCount > 0 ? '/cart' : '#';
  }

  logout(): void {
    this.loginService.logout();
    this.isLoggedIn=false;
    this.router.navigate(['/login']);
  }

  loggedIn():boolean{
    return this.loginService.isAuthenticated();
  }
}
