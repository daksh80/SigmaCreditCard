import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { details } from 'details.interface';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private _route: Router ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fname1: ['', Validators.required],
      password1: ['', Validators.required],
      confirmPassword1: ['', Validators.required],
      fnumber1: ['', Validators.required],
      ActType1: ['', Validators.required],
      CCnumber1: ['', Validators.required],
      CCType1: ['', Validators.required]
    });
  }

  private getUsers(): Observable<details[]> {
    return this.http.get<details[]>('assets/localdb.json');
  }

  signup(): void {
    if (this.signupForm.valid) {
      const {
        fname1,
        password1,
        confirmPassword1,
        fnumber1,
        ActType1,
        CCnumber1,
        CCType1
      } = this.signupForm.value;

      this.getUsers().subscribe((data: details[] | any) => {
        if (Array.isArray(data)) {
          const existingUser = data.find((user: details) => user.fname1 === fname1);
          if (existingUser) {
            console.log('Username already exists');
          } else {
            const newUser: details = {
              fname1,
              password1,
              confirmPassword1,
              fnumber1,
              ActType1,
              CCnumber1,
              CCType1
            };
            this.http.post<any>('http://localhost:3000/signup', newUser)
              .subscribe(
                () => {
                  console.log('Signup successful');
                  data.push(newUser);
                  this.signupForm.reset()
                  this._route.navigate(['dashboard'])
                  // Save the updated user array back to the JSON file or perform necessary actions
                },
                error => {
                  console.log('Error during signup', error);
                }
              );
          }
        } else {
          console.log('User data is not an array');
        }
      });
    }
  }
}
