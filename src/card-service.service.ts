import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  cardNumber = new Subject<string>();
  cardName = new Subject<string>();
  cardExpireMonth = new Subject<string>();
  cardExpireYear = new Subject<string>();
  cardCVV = new Subject<string>();
  cardFlip = new BehaviorSubject<Boolean>(false);
  cardType = new BehaviorSubject<string>("visa");

  getCardType (CardNumber:any) {
    let number = CardNumber; 
    let re = new RegExp('^4')
    if (number.match(re) != null) return 'visa'

    re = new RegExp('^(34|37)')
    if (number.match(re) != null) return 'amex'

    re = new RegExp('^5[1-5]')
    if (number.match(re) != null) return 'mastercard'

    re = new RegExp('^6011')
    if (number.match(re) != null) return 'discover'

    re = new RegExp('^62')
    if (number.match(re) != null) return 'unionpay'

    re = new RegExp('^9792')
    if (number.match(re) != null) return 'troy'

    re = new RegExp('^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}')
    if (number.match(re) != null) return 'dinersclub'

    re = new RegExp('^35(2[89]|[3-8])')
    if (number.match(re) != null) return 'jcb'

    return '' // default type
  }

  CheckCardType(){
    this.cardNumber.subscribe(res =>{
      let currentCardNumber = res;
      this.cardType.next(this.getCardType(currentCardNumber)); 
    })
  } 

  constructor() { }
}
