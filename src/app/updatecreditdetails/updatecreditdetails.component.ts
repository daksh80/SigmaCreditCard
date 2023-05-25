import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {  Router } from '@angular/router';
import { SharedService } from 'src/shared.service';

@Component({
  selector: 'app-updatecreditdetails',
  templateUrl: './updatecreditdetails.component.html',
  styleUrls: ['./updatecreditdetails.component.css']
})
export class UpdatecreditdetailsComponent implements OnInit {
  constructor(private _https: HttpClientModule, private route: Router, private shared: SharedService,private fb: FormBuilder) { }
  updatecreditcard!: FormGroup
  
  ngOnInit(): void {
    this.updatecreditcard = this.fb.group({
      
    });
      
  }
  update(): void{
    
  }
}
