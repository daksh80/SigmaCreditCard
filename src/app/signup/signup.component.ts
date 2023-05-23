import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
  
export class SignupComponent implements OnInit {
  signup: FormGroup | any
  signusr: any;
  constructor(private _router: Router,private _http: HttpClient,private _toastr: ToastrService) {}
  ngOnInit(): void {
    this.signup = new FormGroup({
      'fname': new FormControl(),
      'password': new FormControl(),
      'fnumber': new FormControl(),
      'CCnumber': new FormControl(),
      'CCType': new FormControl(),
      'ConformPassword': new FormControl()
    })
  }
  // signupdata(signup: FormGroup) {
  //   console.log(this.signup.value);
  // }
  
  signupdata(signup: FormGroup) {
  console.log(this.signup.value);
  this.signusr = this.signup.value.fname;
  this._http.post<any>("http://localhost:3000/signup", this.signup.value)
    .subscribe(
      res => {
        this._toastr.success(this.signusr, 'You are successfully signed up');
        this.signup.reset();
        this._router.navigate(['login']);
      },
      err => {
        alert("Something went wrong");
      }
    );
  }

}


