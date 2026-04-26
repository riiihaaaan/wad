import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// How to run it:
// Open your terminal and navigate to the project folder: `cd "assignment-5-angular-auth/auth-app"`
// Start the Angular server: `ng serve -o` (or `npm start`)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Angular Auth App (CLI Minimal)</h2>
      
      <!-- Register Component -->
      <div *ngIf="!isLoggedIn && currentView === 'register'" style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; width: 300px;">
        <h3>Register User</h3>
        <input type="text" [(ngModel)]="regUser.name" placeholder="Name" style="display: block; margin: 10px 0; padding: 5px; width: 90%;">
        <input type="email" [(ngModel)]="regUser.email" placeholder="Email" style="display: block; margin: 10px 0; padding: 5px; width: 90%;">
        <input type="password" [(ngModel)]="regUser.password" placeholder="Password" style="display: block; margin: 10px 0; padding: 5px; width: 90%;">
        <button (click)="register()">Register</button>
        <p><a href="javascript:void(0)" (click)="currentView='login'">Already have an account? Login</a></p>
      </div>

      <!-- Login Component -->
      <div *ngIf="!isLoggedIn && currentView === 'login'" style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; width: 300px;">
        <h3>Login User</h3>
        <input type="email" [(ngModel)]="loginUser.email" placeholder="Email" style="display: block; margin: 10px 0; padding: 5px; width: 90%;">
        <input type="password" [(ngModel)]="loginUser.password" placeholder="Password" style="display: block; margin: 10px 0; padding: 5px; width: 90%;">
        <button (click)="login()">Login</button>
        <p><a href="javascript:void(0)" (click)="currentView='register'">New user? Register</a></p>
      </div>

      <!-- Profile Component -->
      <div *ngIf="isLoggedIn" style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; width: 300px;">
        <h3>User Profile</h3>
        <p><strong>Name:</strong> {{ loggedInUserData?.name }}</p>
        <p><strong>Email:</strong> {{ loggedInUserData?.email }}</p>
        <button (click)="logout()">Logout</button>
      </div>
    </div>
  `
})
export class App {
  currentView = 'register';
  isLoggedIn = false;
  users: any[] = [];

  regUser: any = {};
  loginUser: any = {};
  loggedInUserData: any = null;

  register() {
    this.users.push({ ...this.regUser });
    alert('Registration successful! Please login.');
    this.regUser = {};
    this.currentView = 'login';
  }

  login() {
    const foundUser = this.users.find(u => u.email === this.loginUser.email && u.password === this.loginUser.password);
    if (foundUser) {
      this.isLoggedIn = true;
      this.loggedInUserData = foundUser;
      this.loginUser = {};
    } else {
      alert('Invalid credentials!');
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.loggedInUserData = null;
    this.currentView = 'login';
  }
}
