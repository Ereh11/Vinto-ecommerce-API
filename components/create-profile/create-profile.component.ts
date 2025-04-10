import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-create-profile",
  template: `
    <div class="create-profile-container">
      <h2>Complete Your Profile</h2>

      <form (ngSubmit)="onSubmit()" #profileForm="ngForm">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            [(ngModel)]="profile.firstName"
            required
          />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            [(ngModel)]="profile.lastName"
            required
          />
        </div>

        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            [(ngModel)]="profile.phoneNumber"
            required
          />
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <textarea
            id="address"
            name="address"
            [(ngModel)]="profile.address"
            required
          ></textarea>
        </div>

        <button type="submit" [disabled]="!profileForm.valid">
          Create Profile
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .create-profile-container {
        max-width: 500px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .form-group {
        margin-bottom: 1rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
      }

      input,
      textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      button {
        width: 100%;
        padding: 0.75rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:disabled {
        background: #ccc;
      }
    `,
  ],
})
export class CreateProfileComponent implements OnInit {
  profile = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Log the query parameters
    this.route.queryParams.subscribe((params) => {
      console.log("Create Profile Query Params:", params);

      // Store the token and userId if they exist
      if (params["token"] && params["userId"]) {
        localStorage.setItem("token", params["token"]);
        localStorage.setItem("userId", params["userId"]);
      }
    });
  }

  onSubmit() {
    // Call your API to save the profile
    const userId = localStorage.getItem("userId");
    if (userId) {
      // Add your API call here to save the profile
      // After successful save, redirect to home
      this.router.navigate(["/home"]);
    }
  }
}
