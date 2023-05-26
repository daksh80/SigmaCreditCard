import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { details } from 'details.interface';
import { creditcard } from 'creditcard.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private detailsArraySubject: BehaviorSubject<details[] | null> = new BehaviorSubject<details[] | null>(null);
  private creditArraySubject: BehaviorSubject<creditcard[] | null> = new BehaviorSubject<creditcard[] | null>(null);

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

  getCreditCardArray(): BehaviorSubject<creditcard[] | null> {
    return this.creditArraySubject;
  }

  updateCreditCard(creditCard: creditcard): void {
    this.http.put(`http://localhost:3000/addcreditcard/${creditCard.id}`, creditCard).subscribe(() => {
      console.log(`Credit card updated successfully: ${creditCard.id}`);
    });
  }
}
