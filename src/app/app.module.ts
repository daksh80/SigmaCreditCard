import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CardComponent } from "./card/card.component";
import { EmiCalculatorComponent } from "./emi-calculator/emi-calculator.component";
import { OffersComponent } from "./offers/offers.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { CreditcardComponent } from "./creditcard/creditcard.component";
import { UpdatecreditdetailsComponent } from "./updatecreditdetails/updatecreditdetails.component";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { HighchartsChartModule } from "highcharts-angular";
import { ProfileComponent } from './profile/profile.component';
import { MatSelectModule } from '@angular/material/select';
import { IMaskModule } from "angular-imask";
import {MatButtonModule} from '@angular/material/button';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
//import { NzButtonModule } from 'ng-zorro-antd/button'; 

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    EmiCalculatorComponent,
    OffersComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    CreditcardComponent,
    UpdatecreditdetailsComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule,
    HighchartsChartModule,
    MatSelectModule,
    IMaskModule,
    MatButtonModule,
    // NzButtonModule,
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
