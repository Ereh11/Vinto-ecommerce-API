import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-auth-callback",
  template: ` <div class="loading">Processing authentication...</div> `,
  styles: [
    `
      .loading {
        text-align: center;
        padding: 2rem;
      }
    `,
  ],
})
export class AuthCallbackComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.handleAuthCallback();
  }
}
