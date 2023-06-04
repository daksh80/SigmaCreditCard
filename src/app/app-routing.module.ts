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
  { redirectTo: "login", path: "", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "login/signup", component: SignupComponent },
  {
    path: "dashboard/:uid",
    component: DashboardComponent,
    canActivate: [AuthgardGuard],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthgardGuard],
  },
  { path: "offers", component: OffersComponent, canActivate: [AuthgardGuard] },
  {
    path: "creditcard",
    component: CreditcardComponent,
    canActivate: [AuthgardGuard],
  },
  {
    path: "card/:uid",
    component: CardComponent,
    canActivate: [AuthgardGuard],
  },
  {
    path: "emi-calculator",
    component: EmiCalculatorComponent,
    canActivate: [AuthgardGuard],
  },
  {
    path: "updatecreditdetails",
    component: UpdatecreditdetailsComponent,
    canActivate: [AuthgardGuard],
  },
  { path: "", component: LoginComponent },
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
