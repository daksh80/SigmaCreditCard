import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { creditcard } from 'creditcard.interface'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-creditcard',
  templateUrl: './creditcard.component.html',
  styleUrls: ['./creditcard.component.css']
})
export class CreditcardComponent implements OnInit {
  addcreditcard!: FormGroup;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addcreditcard = this.fb.group({
      CCNo: ['', Validators.required],
      CCName: ['', Validators.required],
      CCExp: ['', Validators.required],
      Bname: ['', Validators.required],
      Cvvnum: ['', Validators.required]
    });
  }

  private getUsers(): Observable<creditcard[]> {
    return this.http.get<creditcard[]>('http://localhost:3000/addcreditcard'); // Provide the correct endpoint URL for fetching credit card data
  }

  addcc(): void {
  if (this.addcreditcard.valid) {
    const { CCNo, CCName, CCExp, Bname, Cvvnum } = this.addcreditcard.value;

    const newCreditcard: creditcard = {
      CCNo,
      CCName,
      CCExp,
      Bname,
      Cvvnum
    };

    this.http
      .post('http://localhost:3000/addcreditcard', newCreditcard)
      .subscribe(
        (response) => {
          // Data added successfully
          console.log('Data added:', response);
          // You can perform additional actions here, such as navigating to a different page
        },
        (error) => {
          console.error('Error adding data:', error);
          // Handle the error condition as needed
        }
      );
  }
}
}
