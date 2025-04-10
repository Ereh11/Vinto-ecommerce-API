import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log("AuthGuard executing");
    console.log("Route:", route.routeConfig?.path);
    console.log("Query Params:", route.queryParams);

    // Check for token in query params first
    const queryToken = route.queryParams["token"];
    if (queryToken) {
      console.log("Valid profile access");
      localStorage.setItem("token", queryToken);
      localStorage.setItem("userId", route.queryParams["userId"]);
      return true;
    }

    // Check for token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      this.router.navigate(["/login"]);
      return false;
    }

    return true;
  }
}
