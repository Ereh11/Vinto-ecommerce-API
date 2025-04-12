import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = "http://localhost:4000/api/auth";

  constructor(private http: HttpClient, private router: Router) {}

  loginWithGoogle() {
    window.location.href = `${this.baseUrl}/google/login`;
  }

  signupWithGoogle() {
    window.location.href = `${this.baseUrl}/google/signup`;
  }

  handleAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    const newUser = params.get("newUser");

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      if (newUser === "true") {
        this.router.navigate(["/create-profile"]);
      } else {
        this.router.navigate(["/home"]);
      }
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }
}
