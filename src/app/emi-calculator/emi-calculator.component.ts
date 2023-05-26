import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.css']
})
export class EmiCalculatorComponent implements OnInit {
  emiCalculate!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
    // Handle the form submission logic here
  }
}
