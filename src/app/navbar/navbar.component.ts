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
  shareduid: string | null = null; ;

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

  goToDashboard(): void {
    console.log("goToDashboard", this.shareduid);
    if (this.shareduid) {
      debugger;
      this._router.navigate([`dashboard/${this.shareduid}`]);
    } else {
      // Handle the case when dashUid is undefined
      console.log("dashUid is undefined");
      // You can choose to display an error message or take any other appropriate action
    }
  }
  

  logout(): void {
    console.log("logout");
    localStorage.removeItem('logindata');
    this._router.navigate(['']);
  }
  AddCreditCard() : void{
    console.log('Add credit card')
    this._router.navigate(['creditcard']);
  }
  emicalculator() : void{
    console.log('emi calculator');
    this._router.navigate(['emi-calculator']);
  }
  profile() : void{
    console.log('profile');
    this._router.navigate(['profile']);
  }
}
