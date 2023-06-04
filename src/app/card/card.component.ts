import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { creditcard } from "creditcard.interface";
import { details } from "details.interface";
import { emicalculator } from "emicalculator.interface";
import { Observable, catchError, map, of } from "rxjs";
import { SharedService } from "src/shared.service";
import { IMaskModule } from 'angular-imask';
import { CardServiceService } from "src/card-service.service";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  creditList: creditcard[] = [];
   @Input() uid: string | undefined = "1";
  cardType: emicalculator[] = [];
  creditLimit: string | undefined;
  cardActiveIn: string | undefined;
  detail: creditcard[] = [];
  getdata: string | null | undefined;


  // updated code
  loggedInUser : details | null | undefined;

  // card 
  // isCardFlipped: boolean = false;   
  // randomBackgrounds: {
  //   type: Boolean;
  //   default: true;
  // } | undefined;
  // backgroundImage: [String, Object] | undefined; 
  // cardNumber: string | undefined;
  // imask = {mask:'0000 000 000 0000'};
  // name:string | undefined;
  bgImage:any; 

  constructor(
    private http: HttpClient,
  private router: Router,
  private sharedService: SharedService,
  public _cardSer: CardServiceService,
  public router_ : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loggedInUser = null;
    console.log("ngonInit card",this.uid);
    this.uid = this.router_.snapshot.paramMap?.get("uid") || "";
    if (this.uid !== undefined) {
      this.sharedService.setuid(this.uid);
    }
         
      // console.log("this.loggedInUser",this.loggedInUser?.uid);
      console.log("this.uid ngonint", this.uid)
    this.sharedService
      .getUserCreditCard(this.uid)
      .subscribe((creditCards: creditcard[]) => {
        this.creditList = creditCards;
        console.log("12121", creditCards);
      });
       this.bgImage = this.currentCardBackground();
     
  }
  /**
   * @description this function takes data from json server and return creditcard details from addcreditcard json 
   * @returns return getuser as Observable
   */

  private getUsers(): Observable<creditcard[]> {
    return this.http.get<creditcard[]>("http://localhost:3000/addcreditcard");
  }
  
  /**
   * @description  
   * @param detail
   * @returns  
   */

  onCardClick(detail: creditcard) {
    if(detail.Act == "Active"){
    this.sharedService.setEmicreditcardArray([detail]);
    this.cardActiveIn = detail.Act;
    console.log("card Active or inActive", this.cardActiveIn);
    this.getcardname(detail.CCType).subscribe(
      (cardName: emicalculator[]) => {
        this.cardType = cardName;
        console.log(this.cardType[0].LoanLimit);
        this.creditLimit = this.cardType[0].LoanLimit;
        this.sharedService.setcreditLimit(this.creditLimit);
        //this.route.navigate([this.cardType[0].LoanLimit])
      }
    );
    
    console.log("clickable detailed array", detail.CCType);
    this.router.navigate([`dashboard/${this.uid}`]);
    }
    this.onclicklimitset();
  }

  onclicklimitset() {
    this.sharedService.cardComponentSubject.next(1);
  }

  private getEmicalculator(): Observable<emicalculator[]> {
    return this.http.get<emicalculator[]>("http://localhost:3000/emiCalculator");
  }

  getcardname(cardName: string): Observable<emicalculator[]> {
     
    return this.getEmicalculator().pipe(
      map((emidata: emicalculator[]) => {
        console.log("flag", emidata);
         
        return emidata.filter((card: emicalculator) => card.CCType === cardName);
      }),
      catchError((err) => {
        console.log(err);
        this.getdata = localStorage.getItem("data");
        const carddata = JSON.parse(this.getdata || "");
        const carddataArray = carddata?.emiCalculator || [];
        console.log("roi Credit Card Details:", carddataArray);
        return of(carddataArray.filter((card: emicalculator) => card.CCType === cardName));
      })
    );
  }

  // counter = (i:number) => { return (new Array(i)); }
  currentCardBackground () {
    let random = Math.floor(Math.random() * 25 + 1)
    return `assets/images/${random}.jpeg`; 
  }


  update(detail: creditcard): void {
    this.sharedService.setCreditCardArray([detail]);
     
    this.router.navigate(["updatecreditdetails"]);
     
    console.log(detail);
    //window.location.reload();
  }

  delete(id: string): void {
    this.http.delete("http://localhost:3000/addcreditcard/" + id).subscribe(
      (data) => {
        console.log(data);
        this.getUsers();
        this.deleteFromLocalStorage(id); // Delete from local storage
        window.location.reload(); // Reload the page after deletion
      },
      (error) => {
        console.error("Error deleting data from JSON server:", error);
        console.log("delete id",id);
        this.deleteFromLocalStorage(id); 
       // window.location.reload(); 
      }
    );
  }
  
  
  private deleteFromLocalStorage(id: string): void {
    const localStorageData = localStorage.getItem("data");
    console.log("localstorage data max",localStorageData);    
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const addCreditCardData = parsedData.addcreditcard;
  
      const updatedAddCreditCardData = addCreditCardData.filter((card: any) => card.id != id);
      parsedData.addcreditcard = updatedAddCreditCardData;
      console.log("parsedData",parsedData)
      localStorage.setItem("data", JSON.stringify(parsedData));
    }
  
   // window.location.reload();
  }
  
  
  
  
  toggleCardStatus(detail: any): void {
    console.log("toggleCardStatus", detail);
    let updatedCard = { ...detail };
    console.log("updated Card", updatedCard);
    updatedCard.Act = updatedCard.Act === "Active" ? "Inactive" : "Active";
  
    const localStorageData = localStorage.getItem("data");
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const updateCreditCards = parsedData.addcreditcard;
  
      // Find the index of the credit card to update
      const index = updateCreditCards.findIndex((card: any) => card.id === detail.id);
  
      if (index !== -1) {
        // Update the credit card in the array
        updateCreditCards[index] = updatedCard;
        
        // Save the updated array back to local storage
        localStorage.setItem("data", JSON.stringify(parsedData));
      }
    }
  
    this.sharedService.updateCreditCard(updatedCard);
  }
  
}
