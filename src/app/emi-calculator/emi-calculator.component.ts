import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.css']
})
export class EmiCalculatorComponent implements OnInit {
  emiCalculate!: FormGroup;
  emi: number = 0; // Assign an initial value to the 'emi' property

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.emiCalculate = this.fb.group({
      CClimit: [0],
      CCSpend: [0],
      CCtenure: [0],
      CCItyp: [0],
      CCIntr: [''],
      CCMY: [''],
      CCType: ['']
    });
  }

  updateLimitValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.emiCalculate.patchValue({ CClimit: value });
  }

  updateSpendValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.emiCalculate.patchValue({ CCSpend: value });
  }

  updateTenureValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.emiCalculate.patchValue({ CCtenure: value });
  }

  updateInterestTypeValue(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.emiCalculate.patchValue({ CCItyp: value });
  }

  emiCalculategrp(): void {
    const CClimit = this.emiCalculate.get('CClimit')?.value;
    const CCSpend = this.emiCalculate.get('CCSpend')?.value;
    const CCtenure = this.emiCalculate.get('CCtenure')?.value;
    const CCItyp = this.emiCalculate.get('CCItyp')?.value;
    const CCIntr = this.emiCalculate.get('CCIntr')?.value;
    const CCMY = this.emiCalculate.get('CCMY')?.value;
    const CCType = this.emiCalculate.get('CCType')?.value;

    const principal = CCSpend - CClimit;
    const rateOfInterest = CCIntr / 100;
    const timePeriod = CCtenure;

    const emi = (principal * rateOfInterest * Math.pow(1 + rateOfInterest, timePeriod)) /
      (Math.pow(1 + rateOfInterest, timePeriod) - 1);

    this.emi = emi;
    console.log(this.emi)
  }
}
