import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { details } from 'details.interface';
import { creditcard } from 'creditcard.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private detailsArraySubject: BehaviorSubject<details[] | null> = new BehaviorSubject<details[] | null>(null);
  private creditArraySubject: BehaviorSubject<creditcard | null> = new BehaviorSubject<creditcard | null>(null);

  constructor() { }

  setDetailsArray(detailsArray: details[]): void {
    this.detailsArraySubject.next(detailsArray);
  }

  getDetailsArray(): BehaviorSubject<details[] | null> {
    return this.detailsArraySubject;
  }

  setcreditcardArray(creditcarddetail: creditcard): void{
    this.creditArraySubject.next(creditcarddetail)
  }

}
