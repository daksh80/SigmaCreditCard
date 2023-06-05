import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { creditcard } from 'creditcard.interface';
import { take } from 'rxjs';
import { SharedService } from 'src/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() uid: string | undefined;
  creditList: creditcard[] = [];
  dashUid: string | undefined = '';
  flag = false;
  shareduid: string | null = null;
  // authService: any;
 
  constructor(private _router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    console.log("ngOnInit", this.dashUid);
    if (!this.flag) {
      this.getCreditCardDetails();
    }
    this.sharedService.getuid().pipe(take(1)).subscribe((selectedArray: string | null) => {
      this.shareduid = selectedArray;
      console.log("this.shareduid", this.shareduid);
    });
    
  }
  
  /**
   * @description this function get creditcard details
   */

  getCreditCardDetails(): void {
    this.sharedService.getUserCreditCard(this.dashUid).subscribe((creditCards: creditcard[]) => {
      this.creditList = creditCards;
      if (this.creditList.length > 0 && !this.dashUid) {
        const firstCreditCard = this.creditList[0];
        console.log("nav_bar_ram", firstCreditCard.uid);
        this.dashUid = firstCreditCard.uid;
        console.log("this.dashUid", this.dashUid);
        this.flag = true;
      }
    });
  }

  /**
   * @description this function navigate to card component 
   */

  goToDashboard(): void {
    console.log("goToDashboard", this.shareduid);
    if (this.shareduid) {
       
      this._router.navigate([`card/${this.shareduid}`]);
    } else {
      // Handle the case when dashUid is undefined
      console.log("dashUid is undefined");
      // You can choose to display an error message or take any other appropriate action
    }
  }
  
  /**
   * @description this function remove logindata & token from localstorage and navigate to login component
   */

  logout(): void {
    console.log("logout");
    // this.authService.logout();
    localStorage.removeItem('logindata');
    localStorage.removeItem('token');
    this._router.navigate(['']);
  }
  /**
   * @description  this function navigate to credicard component
   */
  AddCreditCard() : void{
    console.log('Add credit card')
    this._router.navigate(['creditcard']);
  }
  /**
   * @description this function navigate to emi-calculator component
   */
  emicalculator() : void{
    console.log('emi calculator');
    this._router.navigate(['emi-calculator']);
  }
  /**
   * @description this function  navigate to profile component
   */
  profile() : void{
    console.log('profile');
    this._router.navigate(['profile']);
  }
}
