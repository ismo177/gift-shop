import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class Login2Component {
  errorMessage = '';
  successMessage: string = '';
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    this.isSubmitting = true;
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.loginService.login(username, password).subscribe(
      (response) => {
        this.isSubmitting = false;
        if (response && response.token) {
          this.loginService.saveToken(response.token);
          this.successMessage = `${response.username} logged in`;
          this.messageService.changeMessage(this.successMessage);
          this.router.navigate(['/']);
          this.loginForm.reset();
        } else {
          this.errorMessage = 'Invalid credentials';
          this.successMessage = '';
        }
      },
      (error) => {
        this.isSubmitting = false;
        if (error.status === 401) {
          this.errorMessage = 'Invalid credentials';
        } else {
          this.errorMessage = 'Login failed, please try again.';
        }
        this.successMessage = '';
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
