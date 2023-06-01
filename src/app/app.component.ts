import { Component, OnInit } from '@angular/core';
import * as jsonData from 'db.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    
  }
  constructor(){

  }
  
  title = 'SigmaCreditCard';
}
