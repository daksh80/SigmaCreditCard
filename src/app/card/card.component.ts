import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { creditcard } from "creditcard.interface";
import { details } from "details.interface";
import { emicalculator } from "emicalculator.interface";
import { Observable, catchError, map, of } from "rxjs";
import { SharedService } from "src/shared.service";
import { IMaskModule } from 'angular-imask';

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  creditList: creditcard[] = [];
   @Input() uid: string | undefined = "1"; // @Input() decorator is used in Angular to mark a property as an input property.
  cardType: emicalculator[] = [];
  creditLimit: string | undefined;
  cardActiveIn: string | undefined;
  detail: creditcard[] = [];
  getdata: string | null | undefined;


  // updated code
  loggedInUser : details | null | undefined;
  bgImage:any; 

  /**
   * Constructor
   * @param http HttpClient
   * @param router Router
   * @param sharedService SharedService
   * @param router_ ActivatedRoute
   */
  constructor(
    private http: HttpClient,
  private router: Router,
  private sharedService: SharedService,
  public router_ : ActivatedRoute
  ) {}

  /**
   * OnInit lifecycle hook
   */
  ngOnInit(): void {
   this.loggedInUser = null;
    this.uid = this.router_.snapshot.paramMap.get("uid") || "";
    //The snapshot in Angular provides a static snapshot of the current route state, including parameters, query parameters, and data.
    if (this.uid !== undefined) {
      this.sharedService.setuid(this.uid);
    }
    const logindata = localStorage.getItem("logindata");
    if (logindata !== null) {
      this.loggedInUser = JSON.parse(logindata);
      if (this.loggedInUser) {
        //subscribe() method is used to subscribe to an Observable and receive notifications of new values emitted by the Observable.
        this.sharedService.getUserCreditCard(this.uid).subscribe((creditCards: creditcard[]) => {
          this.creditList = creditCards;
          console.log("Credit Card List:", this.creditList);
        });
      } else {
        // Handle the case when loggedInUser is null or undefined
        console.log("No logged-in user found.");
      }
    } else {
      this.router.navigate(['']);
    }
    if (this.loggedInUser?.uid === this.uid && this.loggedInUser?.uid !== undefined && this.loggedInUser?.uid !== null) {
      this.router.navigate([`card/${this.uid}`]);
    } else {
      // this.router.navigate(['']);
      // localStorage.removeItem('logindata');
    }

    this.bgImage = this.currentCardBackground();
     
  }
  /**
   * @description this function takes data from json server and return creditcard details from addcreditcard json 
   * Gets users from the server
   * @returns Observable of creditcard[]
   */

  private getUsers(): Observable<creditcard[]> {
    // Observables are used extensively in Angular for handling asynchronous operations, such as making HTTP requests, handling user input, or listening to events.
    return this.http.get<creditcard[]>("http://localhost:3000/addcreditcard");
  }
  
  /**
   * @description  this function check if card is active or not if card is inactive it will not move to dashboard component and set creditLimit
   * Handles card click event
   * @param detail Credit card details  
   */

  onCardClick(detail: creditcard) {
    const logindata = localStorage.getItem("logindata");
    const uid = logindata ? JSON.parse(logindata).uid : ""; 
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

  /**
   * Sets limit on click
   */
  onclicklimitset() {
    this.sharedService.cardComponentSubject.next(1);
  }
  /**
   * Retrieves emiCalculator data from the server
   * @returns Observable of emicalculator[]
   */
  private getEmicalculator(): Observable<emicalculator[]> {
    return this.http.get<emicalculator[]>("http://localhost:3000/emiCalculator");
  }

  /**
   * Retrieves card name based on card type
   * @param cardName Card type
   * @returns Observable of emicalculator[]
   */
  getcardname(cardName: string): Observable<emicalculator[]> {
     
    return this.getEmicalculator().pipe(    //data processing pipeline (Observable + pipe)
      map((emidata: emicalculator[]) => { // It applies a given transformation function to each value emitted by the source Observable and returns a new Observable with the transformed values.
        console.log("flag", emidata);
         
        return emidata.filter((card: emicalculator) => card.CCType === cardName);
      }),
      catchError((err) => {
        console.log(err);
        this.getdata = localStorage.getItem("data");
        const carddata = JSON.parse(this.getdata || "");   // parser is used to convert it into javascript object
        const carddataArray = carddata?.emiCalculator || [];  // tries to access the emiCalculator property.
        console.log("roi Credit Card Details:", carddataArray);
        return of(carddataArray.filter((card: emicalculator) => card.CCType === cardName));
      })
    );
  }

  // counter = (i:number) => { return (new Array(i)); }

  /**
   * @description card bacckground image
   * Generates a random card background image
   * @returns Image URL
   */
  currentCardBackground () {
    let random = Math.floor(Math.random() * 25 + 1)
    return `assets/images/${random}.jpeg`; 
  }


  /**
   * @description this function update data using uid 
    * Updates credit card details
   * @param detail Credit card details
   */
  update(detail: creditcard): void {
    this.sharedService.setCreditCardArray([detail]);
     debugger;
     console.log("update",detail);

    this.router.navigate([`updatecreditdetails`]);
     
    // window.location.reload();
  }


  /**
   * @description this function delete data from  both json-server and from local storage 
   * @returns call function deleteFromLocalStorage(id)
   *  * Deletes credit card
   * @param id Credit card ID
   */
  deleteCard(id: string): void {
    debugger
    this.http.delete("http://localhost:3000/addcreditcard/" + id).subscribe(
      (data) => {
        console.log(data);
        debugger;
        this.getUsers();
        this.deleteFromLocalStorage(id); // Delete from local storage
        window.location.reload(); // Reload the page after deletion
      },
      (error) => {
        debugger
        console.error("Error deleting data from JSON server:", error);
        console.log("delete id",id);
        this.deleteFromLocalStorage(id); 
       // this.router.navigate
        //window.location.reload();  

      }
    );
  }
  
  /**
   * @description this function delete data(local storage ) from card component 
   * Deletes credit card from local storage
   * @param id Credit card ID
   */
  
  private deleteFromLocalStorage(id: string): void {
    debugger;
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
  
     window.location.reload();
    this.router.navigate([`card/${this.uid}`]);
  }
  
  
  /**
   * Toggles credit card status between active and inactive
   * @param detail Credit card details
   */
  
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
        this.router.navigate([`card/${this.uid}`]); 
      }
      window.location.reload();
      this.router.navigate([`card/${this.uid}`]); 
      
    }
  
    this.sharedService.updateCreditCard(updatedCard);

  }
  
}
