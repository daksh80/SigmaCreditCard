import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OffersComponent } from './offers/offers.component';
import { CreditcardComponent } from './creditcard/creditcard.component';
import { EmiCalculatorComponent } from './emi-calculator/emi-calculator.component';
import { UpdatecreditdetailsComponent } from './updatecreditdetails/updatecreditdetails.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { redirectTo: 'login', path: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login/signup', component: SignupComponent },
  { path: 'dashboard/:uid', component: DashboardComponent },
   { path: 'dashboard', component: DashboardComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'creditcard', component: CreditcardComponent },
  { path: 'emi-calculator', component: EmiCalculatorComponent },
  { path: 'updatecreditdetails', component: UpdatecreditdetailsComponent},
  { path: '', component: LoginComponent},
  { path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
