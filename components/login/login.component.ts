import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <!-- Your regular login form here -->

      <div class="social-login">
        <button (click)="loginWithGoogle()" class="google-btn">
          <img src="assets/google-icon.png" alt="Google Icon" />
          Login with Google
        </button>
      </div>

      <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .google-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
      }

      .google-btn img {
        width: 24px;
        height: 24px;
      }
    `,
  ],
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
