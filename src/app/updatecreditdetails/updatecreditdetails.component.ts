import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { creditcard } from 'creditcard.interface';
import { SharedService } from 'src/shared.service';

@Component({
  selector: 'app-updatecreditdetails',
  templateUrl: './updatecreditdetails.component.html',
  styleUrls: ['./updatecreditdetails.component.css']
})
export class UpdatecreditdetailsComponent implements OnInit {
  updatecreditcard!: FormGroup;
  creditArray: creditcard[] | null = null;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder
  ) { }
  
  ngOnInit(): void {
    this.updatecreditcard = this.fb.group({
      CCNo: ['', Validators.required],
      CCName: ['', Validators.required],
      CCExp: ['', Validators.required],
      Bname: ['', Validators.required],
      Cvvnum: ['', Validators.required]
    });

    this.sharedService.getCreditCardArray().subscribe((creditArray: creditcard[] | null) => {
      this.creditArray = creditArray;
      console.log(this.creditArray?.values)
    });
  }
  
 updatecredit(): void {
  if (this.updatecreditcard.valid && this.creditArray) {
    const postData = this.updatecreditcard.value;
    const id = this.creditArray[0].id; // Assuming there is only one credit card in the array
    this.sharedService.updateCreditCard({ id, ...postData }); // Merge the ID with the form data
  }
}

}
