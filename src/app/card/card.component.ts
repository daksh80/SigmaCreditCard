import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { creditcard } from "creditcard.interface";
import { details } from "details.interface";
import { emicalculator } from "emicalculator.interface";
import { Observable, catchError, map, of } from "rxjs";
import { SharedService } from "src/shared.service";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  creditList: creditcard[] = [];
  @Input() uid: string | undefined = "1";
  cardType: emicalculator[]=[]
  creditLimit: string | undefined
  cardActiveIn : string | undefined
  detail : creditcard[] = []
   

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
    this.cardActiveIn = detail.Act;
    console.log("card Active or inActive",this.cardActiveIn);
    this.getcardname(detail.CCType).subscribe((cardName : emicalculator[])=>{
      this.cardType= cardName
        console.log(this.cardType[0].LoanLimit);
        this.creditLimit=this.cardType[0].LoanLimit
        this.sharedService.setcreditLimit(this.creditLimit); 
      
        //this.route.navigate([this.cardType[0].LoanLimit])
    });
    console.log("clickable detailed array",detail.CCType);
   
    this.onclicklimitset()
  }

  onclicklimitset(){
      this.sharedService.cardComponentSubject.next(1)
  }

  private getEmicalculator(): Observable<emicalculator[]> {
    return this.http.get<emicalculator[]>("http://localhost:3000/emiCalculator");
  }

  getcardname(cardName: string): Observable<emicalculator[]>{
    debugger;
    return this.getEmicalculator().pipe(
    map((emidata: emicalculator[])=>{
      console.log('flag',emidata);
      debugger;
       return emidata.filter((card: emicalculator) => card.CCType === cardName);
    }),
    catchError((err) => {
      console.log(err);
      return of([]);
    })
    )
}


  update(detail: creditcard): void {
    this.sharedService.setCreditCardArray([detail]); 
    this.route.navigate(["updatecreditdetails"]);
    console.log(detail);
    window.location.reload()

  }

  delete(id: string): void {
    this.http
      .delete("http://localhost:3000/addcreditcard/" + id)
      .subscribe((data) => {
        console.log(data);
        this.getUsers();
      });
     window.location.reload()
  }

 toggleCardStatus(detail: creditcard): void {
    const updatedCard = { ...detail };
    updatedCard.Act = updatedCard.Act === 'Active' ? 'Inactive' : 'Active';
    this.sharedService.updateCreditCard(updatedCard);
    window.location.reload()
  }
}
  
