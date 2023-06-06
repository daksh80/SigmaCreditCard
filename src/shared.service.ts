import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { details } from 'details.interface';
import { creditcard } from 'creditcard.interface';
import { HttpClient } from '@angular/common/http';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private detailsArraySubject: BehaviorSubject<details[] | null> = new BehaviorSubject<details[] | null>(null);
  private creditArraySubject: BehaviorSubject<creditcard[] | null> = new BehaviorSubject<creditcard[] | null>(null);
  private emicreditcardArraySubject: BehaviorSubject<creditcard[] | null> = new BehaviorSubject<creditcard[] | null>(null);
  private limit: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private uidSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  getdata: string | null | undefined;

  constructor(private http: HttpClient) { }

  isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  /***
   *@description- setDetailsArray return  data from http://localhost:3000/signup and localstorage from signup array and 
   * Sets the details array and emits the new value
   * @argument - detailsArray type  of details instances of classes derived from that interface can be returned.  
   * @extends - this function exported to signup component
   * @type   private detailsArraySubject: BehaviorSubject<details[] | null> = new BehaviorSubject<details[] | null>(null);
   * @param detailsArray The details array to be set
   * @returns - this function return detailsArray
   */

   setDetailsArray(detailsArray: details[]): void {
    this.detailsArraySubject.next(detailsArray);
  }
  /***
   * @description - this function pass detailsArray  and it store data of user 
   * @param getDetailsArray
   * @returns - this function return detailed Array after storing it and this function is dependent on setDetailsArray
   */

  getDetailsArray(): BehaviorSubject<details[] | null> {
    return this.detailsArraySubject;
  }

  /**
   * @description this function takes creditcard details and stored in creditCardArray of instance creditcard type
   * @param creditCardArray
   * @type private creditArraySubject: BehaviorSubject<creditcard[] | null> = new BehaviorSubject<creditcard[] | null>(null);
   * @returns this function return  creditCardArray
   */

  setCreditCardArray(creditCardArray: creditcard[]): void {
    this.creditArraySubject.next(creditCardArray);
  }

  /**
   * 
   * @description this function takes data from getUsers()/localstorage(addcreditcard) function and filter it on the based of uid.
   * @component card.component , dashboard.component , navbar.component
   * @param uid The user's UID
   * @returns this function return creditcardArray after filtering using uid
   */

  getUserCreditCard(uid: string | undefined): Observable<creditcard[]> {
    return this.getUsers().pipe(
      map((data: creditcard[]) => {
        return data.filter((card: creditcard) => card.uid === uid);
      }),
      catchError((err) => {
        console.log("Error:", err);
        this.getdata = localStorage.getItem('data');
        const carddata = JSON.parse(this.getdata || '');
        const carddataArray = carddata?.addcreditcard || [];
        console.log("Credit Card Details:", carddataArray);
        return of(carddataArray.filter((card: creditcard) => card.uid === uid) as creditcard[]);
      })
    );
  }

  /**
   * @component -card component , creditcard.component , login.component, signup.component 
   * @returns this function return addcreditcard data 
   */
  

  getUsers(): Observable<creditcard[]> {
    return this.http.get<creditcard[]>('http://localhost:3000/addcreditcard');
  }

  /**
   * 
   * @component - updatecreditdetails.component
   * @returns this function return credit Array
   */
  getCreditCardArray(): BehaviorSubject<creditcard[] | null> {
    return this.creditArraySubject;
  }

  /**
   * 
   * @component - card.component , updateCreditCard.component 
   * @param creditCard The updated credit card details 
   * @returns this function update credit card details in  json -server
   */
  updateCreditCard(creditCard: creditcard): void {
    this.http.put(`http://localhost:3000/addcreditcard/${creditCard.id}`, creditCard).subscribe(() => {
      console.log(`Credit card updated successfully: ${creditCard.id}`);
    });
  }

  /**
   * @component - card component 
   * @param detail The EMI credit card array to be set
   * @returns  it will return select card array which are in card component
   */

  setEmicreditcardArray(detail: creditcard[]): void {
    this.emicreditcardArraySubject.next(detail);
  }

  /**
   * @component - dashboard.component
   * @returns - it will return selected credit array 
   */
  getEmicreditcardArray(): BehaviorSubject<creditcard[] | null> {
    return this.emicreditcardArraySubject;
  }

  /**
   * @component card.component
   * @param limit The selected card's limit
   * @type private limit: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
   * @return this function set selected card limit like (visa, mastercard, rupy)
   */
  
  setcreditLimit(limit: string): void {
     
    console.log("limit shared service ", limit);
    this.limit.next(limit);
  }
  

  /**
   * @description - this function set credit limit(ROI) on the basis of selected card
   * @component - dashboard.component
   * @param limit - credit limit from somewhere
   * @returns - Credit observable and return limit
   * 
   */
  getcreditLimit(): Observable<string | null> {
     
    return this.limit.asObservable();
  }

  /** 
   * Using for cross-component communication 
   */
  cardComponentSubject = new Subject<any>();

  /**
   * @description this function set uid at the time of login  Check if the uidSubject is already set
   * @param uid The UID to be set
   * @type  private uidSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
   * @return uid observable and return uid
   */

  setuid(uid: string): void {
    if (!this.uidSubject.getValue()) { 
      this.uidSubject.next(uid);
    }
  }
 
  /**
   * 
   * @description this function take uid from setuid function and return  uid 
   * @returns this function return uid as observable type
   */
  
  getuid(): Observable<string | null> {
    return this.uidSubject.asObservable();
  }
  
}
