import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { details } from "details.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "src/shared.service";
import * as jsonData from "db.json";
import * as CryptoJS from "crypto-js";


@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  getdata: string | null | undefined;
  usernameExists: any;
  encryptSecretKey = "5";


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
      fnumber: [""],
      ActType: [""],
      CCnumber: [""],
      CCType: [""],
      uid: ["", Validators.required]
    }, {
      validators: this.passwordCheck.bind(this)
    });
  
    const data = JSON.stringify(jsonData);
    localStorage.setItem("data", data);
    this.getdata = localStorage.getItem("data");
    console.log(this.getdata);
  }
  
 /**
  * Checks if the password and confirm password fields match
   * @param formGroup - The form group containing the password and confirm password fields
   * @returns Returns an object with the error "passwordNotMatch" if the fields don't match, or null if they match
  */
  private passwordCheck(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const ConformPassword = formGroup.get("ConformPassword")?.value;
    return password === ConformPassword ? null : { passwordNotMatch: true };
  }
/**
   * Retrieves the users from the local database
   * @returns An observable with the array of user details
   */
  private getUsers(): Observable<details[]> {
    return this.http.get<details[]>("assets/localdb.json");
  }

  /**
   * @description this function encrypt data(email and password) using CryptoJs library
   * Encrypts the given data using CryptoJS library
   * @param data - The data to be encrypted
   * @returns The encrypted data as a string
   */
  encryptData(data: string) {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.encryptSecretKey
      ).toString();
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  /**
   * @description this function decrypt encrypted data 
   * Decrypts the given encrypted data
   * @param data - The encrypted data to be decrypted
   * @returns The decrypted data
   */

  decryptData(data: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  // ...
  /**
   * @description this is a signup function  and it's passes data into local storge 
   * Signs up the user by saving the data to the local storage and JSON server
   */
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

    this.getUsers().subscribe((data: details[] | any) => { // it's data from getUser (async function)
      debugger
      if (Array.isArray(data)) {
        debugger
        const existingUser = data.find((user: details) => user.fname === fname);   // check if data is existing in the localstorage 
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
          const localStorageData = localStorage.getItem("data");   // it's takes data from localstoage and store into localstorage data
          if (localStorageData) {
            const parsedData = JSON.parse(localStorageData);   
            parsedData.signup.push(newUser);
            console.log("new User uid", newUser.uid);
            const loginData = {
              fname: newUser.fname,
              password: newUser.password,
              ConformPassword: newUser.ConformPassword,
              fnumber: newUser.fnumber,
              ActType: newUser.ActType,
              CCnumber: newUser.CCnumber,
              CCType: newUser.CCType,
              uid: newUser.uid
            };

            localStorage.setItem("logindata", JSON.stringify(loginData));  // setting data into localstorage (logindata:- key )
            localStorage.setItem("data", JSON.stringify(parsedData));   //setting data into localstorage (data:- key)
            localStorage.setItem("token",JSON.stringify(this.encryptData(fname + password))) //setting data into localstorage (encryptData , token:- key)
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