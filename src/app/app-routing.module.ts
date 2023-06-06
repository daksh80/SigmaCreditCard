import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { OffersComponent } from "./offers/offers.component";
import { CreditcardComponent } from "./creditcard/creditcard.component";
import { EmiCalculatorComponent } from "./emi-calculator/emi-calculator.component";
import { UpdatecreditdetailsComponent } from "./updatecreditdetails/updatecreditdetails.component";
import { ProfileComponent } from "./profile/profile.component";
import { AuthgardGuard } from "./authgard.guard";
import { CardComponent } from "./card/card.component";

const routes: Routes = [
  /**
   * Redirects to the login page by default
   */
  { redirectTo: "login", path: "", pathMatch: "full" },
  /**
   * Route for the login page
   */
  { path: "login", component: LoginComponent },
   /**
   * Route for the signup page
   */
  { path: "login/signup", component: SignupComponent },
  /**
   * Route for the dashboard page with UID parameter
   * Requires authentication guard to activate the route
   */
  {
    path: "dashboard/:uid",
    component: DashboardComponent,
    canActivate: [AuthgardGuard],
  },
  /**
   * Route for the dashboard page
   * Requires authentication guard to activate the route
   */
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthgardGuard],
  },
  /**
   * Route for the offers page
   * Requires authentication guard to activate the route
   */
  { path: "offers", component: OffersComponent, canActivate: [AuthgardGuard] },
  /**
   * Route for the credit card page
   * Requires authentication guard to activate the route
   */
  {
    path: "creditcard",
    component: CreditcardComponent,
    canActivate: [AuthgardGuard],
  },
  /**
   * Route for the card page with UID parameter
   * Requires authentication guard to activate the route
   */
  {
    path: "card/:uid",
    component: CardComponent,
    canActivate: [AuthgardGuard],
  },
  /**
   * Route for the EMI calculator page
   * Requires authentication guard to activate the route
   */
  {
    path: "emi-calculator",
    component: EmiCalculatorComponent,
    canActivate: [AuthgardGuard],
  },
  /**
   * Route for the update credit details page
   * Requires authentication guard to activate the route
   */
  {
    path: "updatecreditdetails",
    component: UpdatecreditdetailsComponent,
    canActivate: [AuthgardGuard],
  },
  /**
   * Default route (fallback to login page)
   */
  { path: "", component: LoginComponent },
  /**
   * Route for the profile page
   * Requires authentication guard to activate the route
   */
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthgardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
