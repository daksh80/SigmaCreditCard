import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { details } from 'details.interface';
import { SharedService } from 'src/shared.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private jsonServerEndpoint = 'http://localhost:3000/signup'; // Update with your JSON server endpoint
  private detailsArray: details[] | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      fname: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.getUsers().subscribe((detailsArray: details[] | null) => {
      this.detailsArray = detailsArray;
    });
  }

  private getUsers(): Observable<details[]> {
    return this.http.get<details[]>('assets/localdb.json');
  }

  private checkLoginCredentials(user: details, fname: string, password: string): boolean {
    return user.fname === fname && user.password === password;
  }

  login(): void {
    if (this.loginForm.valid && this.detailsArray) {
      const fname = this.loginForm.value.fname;
      const password = this.loginForm.value.password;

      const existingUser = this.detailsArray.find((user: details) => user.fname === fname);
      if (existingUser) {
        console.log('Username already exists');
        this.loginForm.reset();
        this.router.navigate([`dashboard/${existingUser.uid}`]);
        //this.router.navigate(["dashboard"]);
      } else {
        this.http.get<details[]>(this.jsonServerEndpoint).subscribe((jsonServerData: details[] | any) => {
          if (Array.isArray(jsonServerData)) {
            const user = jsonServerData.find((user: details) =>
              this.checkLoginCredentials(user, fname, password)
            );
            if (user) {
              console.log('User is successfully logged in','${user.uid}');
              this.loginForm.reset();
              this.router.navigate([`dashboard/${user.uid}`]);
              //this.router.navigate(["dashboard"]);
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
  }
}
