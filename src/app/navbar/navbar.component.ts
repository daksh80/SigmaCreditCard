import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { creditcard } from 'creditcard.interface';
import { details } from 'details.interface';
import { Observable } from 'rxjs';
import { SharedService } from 'src/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // authService: any;
  // private detailsArray: details[] | null = null;
  @Input() uid: string | undefined = "1";
  creditList: creditcard[] = [];


  constructor(private _router: Router,private sharedService: SharedService, private http: HttpClient) {}

  // private getUsers(): Observable<details[]> {
  //   return this.http.get<details[]>("http://localhost:3000/addcreditcard");
  // }
  ngOnInit(): void {
    console.log(this.uid);
    this.sharedService
      .getUserCreditCard(this.uid)
      .subscribe((creditCards: creditcard[]) => {
        this.creditList = creditCards;
        console.log("nav_bar", creditCards);
      });
    // this.getUsers().subscribe((detailsArray: details[] | null) => {
    //   this.detailsArray = detailsArray;
    // });
  }
   goToDashboard(): void{
    console.log("dashboard",this.uid);
    this._router.navigate([`dashboard/${this.uid}`]);
    // console.log(this.uid);
  //  console.log("leeloenifewdnfc",this.detailsArray)
  //   this._router.navigate(["updatecreditdetails"])
  }
  logout(): void{
    debugger;
    // this.authService.clearAuthentication();
    console.log("hgoifhvoir");
    this._router.navigate(['']);
  }
}
