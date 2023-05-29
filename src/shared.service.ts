import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
        console.log(err);
        return of([]);
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
}
