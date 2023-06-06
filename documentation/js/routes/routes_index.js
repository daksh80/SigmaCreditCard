var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"redirectTo":"login","path":"","pathMatch":"full"},{"path":"login","component":"LoginComponent"},{"path":"login/signup","component":"SignupComponent"},{"path":"dashboard/:uid","component":"DashboardComponent","canActivate":["AuthgardGuard"]},{"path":"dashboard","component":"DashboardComponent","canActivate":["AuthgardGuard"]},{"path":"offers","component":"OffersComponent","canActivate":["AuthgardGuard"]},{"path":"creditcard","component":"CreditcardComponent","canActivate":["AuthgardGuard"]},{"path":"card/:uid","component":"CardComponent","canActivate":["AuthgardGuard"]},{"path":"emi-calculator","component":"EmiCalculatorComponent","canActivate":["AuthgardGuard"]},{"path":"updatecreditdetails","component":"UpdatecreditdetailsComponent","canActivate":["AuthgardGuard"]},{"path":"","component":"LoginComponent"},{"path":"profile","component":"ProfileComponent","canActivate":["AuthgardGuard"]}],"kind":"module"}]}
