import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { details } from "details.interface";
import { SharedService } from "src/shared.service";
import * as jsonData from "db.json";
import * as CryptoJS from "crypto-js";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private jsonServerEndpoint = "http://localhost:3000/signup"; 
  private detailsArray: details[] | null = null;
  getdata: string | null | undefined;
  encryptSecretKey = "5";
  // authService: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      fname: ["", Validators.required],
      password: ["", Validators.required],
    });

    // this.getUsers().subscribe((detailsArray: details[] | null) => {
    //   this.detailsArray = detailsArray;
    // });

    // for localstoage logic written here
    //localStorage.clear();
    // const data = JSON.stringify(jsonData);
    // localStorage.setItem("data", data);
     this.getdata = localStorage.getItem("data");
    // console.log(this.getdata);

    const signupdata = JSON.parse(this.getdata || "");
    const signupArray = signupdata?.signup || [];
    console.log(signupArray);

    this.detailsArray = signupArray;
  }

  // private getUsers(): Observable<details[]> {
  //   return this.http.get<details[]>('assets/localdb.json');
  // }

  private checkLoginCredentials(
    user: details,
    fname: string,
    password: string
  ): boolean {
    return user.fname === fname && user.password === password;
  }
/**
 * @description this function encryptData using cryptoJs(CryptoJS is a growing collection of standard and secure cryptographic algorithms implemented in JavaScript using best practices and patterns.)
 * Encrypts the data using CryptoJS
   * @param data - The data to be encrypted
   * @returns The encrypted key as a string
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
   * @description thisn function decrypt data  using CryptoJs
  * Decrypts the data using CryptoJS
   * @param data - The data to be decrypted
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
  /**
   * @description this function store data locally(logindata) and genereate token and navigate to card 
   * Handles the login process
   */

  login(): void {
    if (this.loginForm.valid && this.detailsArray) {
      const fname = this.loginForm.value.fname;
      const password = this.loginForm.value.password;

      const existingUser = this.detailsArray.find(
        (user: details) => user.fname === fname
      );
      if (existingUser) {
        console.log("Username already exists");
        this.loginForm.reset(); 
        const logindata = JSON.stringify(existingUser);
        localStorage.setItem("logindata", logindata);
        localStorage.setItem(
          "token",
          JSON.stringify(this.encryptData(fname + password))
        );
        console.log(existingUser, "existing user id");
        this.router.navigate([`card/${existingUser.uid}`]); 
      } else {
        console.log("Invalid username or password");
        alert("Invalid username or password");
      }
    }
  }
}
