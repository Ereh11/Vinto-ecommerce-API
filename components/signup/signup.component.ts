import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-signup",
  template: `
    <div class="signup-container">
      <h2>Sign Up</h2>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div class="social-signup">
        <button (click)="signupWithGoogle()" class="google-btn">
          <img src="assets/google-icon.png" alt="Google Icon" />
          Sign up with Google
        </button>
      </div>

      <p>Already have an account? <a routerLink="/login">Login</a></p>
    </div>
  `,
  styles: [
    `
      .signup-container {
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
export class SignupComponent implements OnInit {
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for error parameter in URL
    this.route.queryParams.subscribe((params) => {
      if (params["error"]) {
        this.error = decodeURIComponent(params["error"]);
      }
    });
  }

  signupWithGoogle() {
    console.log("Redirecting to Google signup...");
    window.location.href = "http://localhost:4000/api/auth/google/signup";
  }
}
