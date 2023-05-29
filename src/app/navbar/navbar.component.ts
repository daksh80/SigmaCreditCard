import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { creditcard } from 'creditcard.interface';
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

  constructor(private _router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    console.log("ngOnInit", this.uid);
    if (!this.flag) {
      this.getCreditCardDetails();
    }
  }

  getCreditCardDetails(): void {
    this.sharedService.getUserCreditCard(this.uid).subscribe((creditCards: creditcard[]) => {
      this.creditList = creditCards;
      if (this.creditList.length > 0 && !this.dashUid) {
        const firstCreditCard = this.creditList[0];
        console.log("nav_bar_ram", firstCreditCard.uid);
        this.dashUid = firstCreditCard.uid;
        console.log("this.dashUid", this.dashUid);
      }
      this.flag = true;
    });
  }

  goToDashboard(): void {
    console.log("goToDashboard", this.dashUid);
    if (this.dashUid) {
      this._router.navigate([`dashboard/${this.dashUid}`]);
    } else {
      // Handle the case when dashUid is undefined
      console.log("dashUid is undefined");
      // You can choose to display an error message or take any other appropriate action
    }
  }  

  logout(): void {
    console.log("logout");
    this._router.navigate(['']);
  }
}
