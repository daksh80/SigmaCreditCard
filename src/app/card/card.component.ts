import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { creditcard } from "creditcard.interface";
import { details } from "details.interface";
import { Observable } from "rxjs";
import { SharedService } from "src/shared.service";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  creditList: creditcard[] = [];
  @Input() uid: string | undefined = "1";

  constructor(
    private http: HttpClient,
    private route: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    
    console.log(this.uid);
    this.sharedService
      .getUserCreditCard(this.uid)
      .subscribe((creditCards: creditcard[]) => {
        this.creditList = creditCards;
        console.log("12121", creditCards);
      });
  }

  private getUsers(): Observable<creditcard[]> {
    return this.http.get<creditcard[]>("http://localhost:3000/addcreditcard");
  }

  onCardClick(detail: creditcard) {
    this.sharedService.setEmicreditcardArray([detail]);
    console.log(detail);
  }

  update(detail: creditcard): void {
    this.sharedService.setCreditCardArray([detail]); 
    this.route.navigate(["updatecreditdetails"]);
    console.log(detail);
  }

  delete(id: string): void {
    this.http
      .delete("http://localhost:3000/addcreditcard/" + id)
      .subscribe((data) => {
        console.log(data);
        this.getUsers();
      });
  }

  ActiveIn(): void {
    // Implement your logic for the ActiveIn function
  }
}
