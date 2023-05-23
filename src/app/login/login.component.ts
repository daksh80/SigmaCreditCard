import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { details } from 'details.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private jsonServerEndpoint = 'http://localhost:3000/signup'; // Update with your JSON server endpoint

  constructor(private fb: FormBuilder, private http: HttpClient, private _route: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      fname1: ['', Validators.required],
      password1: ['', Validators.required]
    });
  }

  private getUsers(): Observable<details[]> {
    return this.http.get<details[]>('assets/localdb.json');
  }

  private checkLoginCredentials(user: details, fname1: string, password1: string): boolean {
    return user.fname1 === fname1 && user.password1 === password1;
  }

  login(): void {
    if (this.loginForm.valid) {
      const fname1 = this.loginForm.value.fname1;
      const password1 = this.loginForm.value.password1;

      this.getUsers().subscribe((localData: details[] | any) => {
        if (Array.isArray(localData)) {
          const existingUser = localData.find((user: details) => user.fname1 === fname1);
          if (existingUser) {
            console.log('Username already exists');
            this.loginForm.reset();
            this._route.navigate(['dashboard']);
          } else {
            this.http.get<details[]>(this.jsonServerEndpoint).subscribe((jsonServerData: details[] | any) => {
              if (Array.isArray(jsonServerData)) {
                const user = jsonServerData.find((user: details) =>
                  this.checkLoginCredentials(user, fname1, password1)
                );
                if (user) {
                  console.log('User is successfully logged in');
                  this.loginForm.reset();
                  this._route.navigate(['dashboard']);
                } else {
                  console.log('Invalid username or password');
                  alert('Invalid username or password');
                }
              } else {
                console.log('Invalid JSON server response');
              }
            });
          }
        }
      });
    }
  }
}
