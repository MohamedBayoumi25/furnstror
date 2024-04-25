import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent {
  @ViewChild('container') container!: ElementRef;
  user: any;
  errorRegister: any;

  constructor(public userService: UsersService, public router: Router) {}

  nameFormatValidator(control: FormControl): ValidationErrors | null {
    const namePattern = /^[^\d]+$/;
    return control.value && !namePattern.test(control.value) ? { 'invalidName': true } : null;
  }

  emailFormatValidator(control: FormControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return control.value && !emailPattern.test(control.value) ? { 'invalidEmail': true } : null;
  }

  passwordFormatValidator(control: FormControl): ValidationErrors | null {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return control.value && !passwordPattern.test(control.value) ? { 'invalidPassword': true } : null;
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password !== confirmPassword ? { 'passwordMismatch': true } : null;
  };

  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, this.nameFormatValidator, Validators.minLength(3)]),
    email: new FormControl(null, [Validators.required, this.emailFormatValidator]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, this.passwordFormatValidator]),
    confirmPassword: new FormControl('', [Validators.required, this.passwordMatchValidator]),
  });

  get getName() {
    return this.registerForm.controls['fullName'];
  }

  get getEmail() {
    return this.registerForm.controls['email'];
  }

  get getPassword() {
    return this.registerForm.controls['password'];
  }

  get getPasswordConfirmation() {
    return this.registerForm.controls['confirmPassword'];
  }

  get getUName() {
    return this.registerForm.controls['username'];
  }

  registerHandler(event: Event): void {
    event.preventDefault();
    if (this.registerForm.valid) {
      this.userService.AddAdmin(this.registerForm.value).subscribe({
        next: (data) => {
          this.user = data;
          localStorage.setItem('usertoken', this.user.token);
          localStorage.setItem('userRole', this.user.roles[1]);
          localStorage.setItem('username', this.user.userName);
          localStorage.setItem('flag', 'true');
          if (localStorage.getItem('usertoken') === this.user.token && localStorage.getItem('userRole') === 'Admin') {
            this.router.navigate(['/user_table']);
          }
          window.location.reload();
        },
        error: (error) => {
          this.errorRegister = error.error;
          console.error(error);
        },
      });
    } else {
      console.log('Fix Form Errors', this.registerForm);
    }
  }
}
