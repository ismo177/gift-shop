import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // To redirect after registration
import { CommonModule, NgIf } from '@angular/common';
import { RegService } from '../registration.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';

@Component({
  standalone:true,
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  imports:[ReactiveFormsModule, CommonModule,NgIf, FormsModule]
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private regService: RegService, private messageService:MessageService) { 
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

  }

  ngOnInit(): void {
  }

  // Custom Validator to check if the password and confirmPassword match
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      return { passwordsNotMatching: true };
    }
    return null;
  }

  // Getters for easy access to form fields in the template
  get username() {
    return this.registrationForm.get('username');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const userData = this.registrationForm.value;
  
      this.regService.register(userData).subscribe({
        next: (response) => {
          const successMessage = `${response.username}`;
          this.messageService.changeMessage(successMessage);  // Send the success message
          this.router.navigate(['/']); // Navigate to home
        },
        error: (err) => {
          this.errorMessage = 'Registration failed!';
          this.successMessage = '';
        }
      });
    }
  }
  
}
