import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { details } from "details.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "src/shared.service";
import * as jsonData from "db.json";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  getdata: string | null | undefined;
usernameExists: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fname: ["", Validators.required],
      password: new FormControl("", Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ])),
      ConformPassword: new FormControl("", Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ])),
      fnumber: ["", Validators.required],
      ActType: ["", Validators.required],
      CCnumber: ["", Validators.required],
      CCType: ["", Validators.required],
      uid: ["", Validators.required]
    }, {
      validators: this.passwordCheck.bind(this)
    });
  
    const localStorageData = localStorage.getItem("data");
    if (!localStorageData) {
      const initialData = {
        signup: []
      };
      localStorage.setItem("data", JSON.stringify(initialData));
    }
  
    this.getdata = localStorage.getItem("data");
  }
  

  private passwordCheck(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const ConformPassword = formGroup.get("ConformPassword")?.value;
    return password === ConformPassword ? null : { passwordNotMatch: true };
  }

  private getUsers(): Observable<details[]> {
    return this.http.get<details[]>("assets/localdb.json");
  }

  signup(): void {
    if (this.signupForm.valid) {
      const {
        fname,
        password,
        ConformPassword,
        fnumber,
        ActType,
        CCnumber,
        CCType,
        uid
      } = this.signupForm.value;
  
      this.getUsers().subscribe((data: details[] | any) => {
        if (Array.isArray(data)) {
          const existingUser = data.find((user: details) => user.fname === fname);
          if (existingUser) {
            console.log("Username already exists");
          } else {
            const newUser: details = {
              fname,
              password,
              ConformPassword,
              fnumber,
              ActType,
              CCnumber,
              CCType,
              uid,
            };
  
            // Update the data in local storage
            const localStorageData = localStorage.getItem("data");
            if (localStorageData) {
              const parsedData = JSON.parse(localStorageData);
              parsedData.signup.push(newUser);
              localStorage.setItem("data", JSON.stringify(parsedData));
              this.router.navigate([`card/${uid}`]); 
            } else {
              const newData = { signup: [newUser] };
              localStorage.setItem("data", JSON.stringify(newData));
              this.router.navigate([`card/${uid}`]); 
            }
  
            // Update the data in JSON server
            this.http.post<any>("http://localhost:3000/signup", newUser).subscribe(
              () => {
                console.log("Data updated in JSON server");
                this.router.navigate(["/login"]);
              },
              (error: any) => {
                console.error("Failed to update data in JSON server", error);
                // Handle error
              }
            );
          }
        }
      });
    } else {
      console.log("Form invalid");
    }
  }
}  