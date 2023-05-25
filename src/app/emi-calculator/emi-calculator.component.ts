import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route } from '@angular/router';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.css']
})
export class EmiCalculatorComponent implements OnInit {
  emiCalculate!: FormGroup
  constructor(private _https: HttpClientModule, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.emiCalculate = this.fb.group({
      CClimit: ['', Validators.required],
      CCSpend: ['', Validators.required],
      CCtenure: ['', Validators.required],
      CCItyp: ['', Validators.required],
      CCIntr: ['', Validators.required],
      CCMY: ['', Validators.required],
      CCType: ['', Validators.required]
    });
  }
  emiCalculategrp(): void{
    
  }
}
