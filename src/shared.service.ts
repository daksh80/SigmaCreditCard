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

  setDetailsArray(detailsArray: details[]): void {
    this.detailsArraySubject.next(detailsArray);
  }

  getDetailsArray(): BehaviorSubject<details[] | null> {
    return this.detailsArraySubject;
  }

  setCreditCardArray(creditCardArray: creditcard[]): void {
    this.creditArraySubject.next(creditCardArray);
  }

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
  

  getUsers(): Observable<creditcard[]> {
    return this.http.get<creditcard[]>('http://localhost:3000/addcreditcard');
  }

  getCreditCardArray(): BehaviorSubject<creditcard[] | null> {
    return this.creditArraySubject;
  }

  updateCreditCard(creditCard: creditcard): void {
    this.http.put(`http://localhost:3000/addcreditcard/${creditCard.id}`, creditCard).subscribe(() => {
      console.log(`Credit card updated successfully: ${creditCard.id}`);
    });
  }

  setEmicreditcardArray(detail: creditcard[]): void {
    this.emicreditcardArraySubject.next(detail);
  }

  getEmicreditcardArray(): BehaviorSubject<creditcard[] | null> {
    return this.emicreditcardArraySubject;
  }

  
  setcreditLimit(limit: string): void {
    debugger;
    console.log("limit shared service ", limit);
    this.limit.next(limit);
  }
  

  /**
   * @description - sadfagjsdf;jhasdlfhjb 
   * @param limit - credit limit from somewhere
   * @returns - Credit observable fdsafdf
   * 
   */
  getcreditLimit(): Observable<string | null> {
    debugger;
    return this.limit.asObservable();
  }

  /** using for cross component comms */
  cardComponentSubject = new Subject<any>();

  setuid(uid: string): void {
    if (!this.uidSubject.getValue()) { // Check if the uidSubject is already set
      this.uidSubject.next(uid);
    }
  }
  
  getuid(): Observable<string | null> {
    return this.uidSubject.asObservable();
  }
  
}
