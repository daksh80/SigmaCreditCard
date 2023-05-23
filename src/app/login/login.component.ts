import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: FormGroup | any;
  constructor(private _route: Router, private _http: HttpClient ) {}
  ngOnInit(): void {
    this.login = new FormGroup({
      'fname': new FormControl(),
      'password': new FormControl()
      })
  }
  logindata(login: FormGroup) {
    // console.log(this.login.value)
    this._http.get<any>("http://localhost:3000/signup")
      .subscribe(
        res => {
          const user = res.find((a: any) => {
            return a.fname === this.login.value.fname && a.password === this.login.value.password;
          });
          if (user) {
            alert("user is successfully login")
            this.login.reset();
            this._route.navigate(['dashboard'])
          } else {
            alert("not able to login ")
            this._route.navigate([login])
          }
        }, err => {
          alert("Something Went Wrong Please try Again");
      }
    )
  }
}
