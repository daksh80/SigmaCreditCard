import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { details } from "details.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { SharedService } from "src/shared.service";


@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fname: ["", Validators.required],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required],
      fnumber: ["", Validators.required],
      ActType: ["", Validators.required],
      CCnumber: ["", Validators.required],
      CCType: ["", Validators.required],
      uid: ["",Validators.required]
    });
    //localStorage.clear();
  }

  private getUsers(): Observable<details[]> {
    return this.http.get<details[]>("assets/localdb.json");
  }

  signup(): void {
    if (this.signupForm.valid) {
      const {
        fname,
        password,
        confirmPassword,
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
              confirmPassword,
              fnumber,
              ActType,
              CCnumber,
              CCType,
              uid
            };
  
            this.http.post<any>("http://localhost:3000/signup", newUser).subscribe(
              () => {
                console.log("Signup successful");
                data.push(newUser);
                // localStorage.setItem("newUser", JSON.stringify(data));
                this.sharedService.setDetailsArray(data);
                this.signupForm.reset();
                this.router.navigate(["dashboard"]);
              },
              (error) => {
                console.log("Error during signup", error);
                console.log("Error response from server:", error.error);
                data.push(newUser);
                // localStorage.setItem("newUser", JSON.stringify(data));
                this.sharedService.setDetailsArray(data);
                this.signupForm.reset();
              }
            );
          }
        } else {
          console.log("User data is not an array");
        }
      });
    }
  }
}  