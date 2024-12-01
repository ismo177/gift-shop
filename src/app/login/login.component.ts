
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { FormBuilder,FormGroup, FormsModule, NgForm, Validators, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';


@Component({
  standalone:true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports:[ReactiveFormsModule, CommonModule, FormsModule]
})
export class LoginComponent {
  errorMessage = '';
  loginForm: FormGroup;
  successMessage:string='';

  constructor(private loginService: LoginService, private router: Router, private fb: FormBuilder, private messageService: MessageService) {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login(): void {
    const username=this.loginForm.value.username;
    const password=this.loginForm.value.password;
    this.loginService.login(username, password).subscribe(
      (response) => {
        if (response && response.token) {
          this.loginService.saveToken(response.token);
          const successMessage = `${response.username +' logged in'}`;
          this.messageService.changeMessage(successMessage); 
          this.router.navigate(['/']); 
        } else {
          this.errorMessage = 'Invalid credentials';
          this.successMessage='';
        }
      },
      (error) => {
        this.errorMessage = 'Login failed, please try again.';
      }
    );
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}


