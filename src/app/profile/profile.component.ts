import { Component, OnInit } from '@angular/core';
import { IMaskModule } from 'angular-imask';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  isCardFlipped: boolean = false;   
  randomBackgrounds: {
    type: Boolean;
    default: true;
  } | undefined;
  backgroundImage: [String, Object] | undefined; 
  cardNumber: string | undefined;
  imask = {mask:'0000 000 000 0000'};
  name:string | undefined;
  bgImage:any; 

  counter = (i:number) => { return (new Array(i)); }

  currentCardBackground () {
    let random = Math.floor(Math.random() * 25 + 1)
    return `assets/images/${random}.jpeg`; 
  }

  constructor() { }

  ngOnInit(): void {
    this.bgImage = this.currentCardBackground();
  } 

}
