import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { creditcard } from "creditcard.interface";
import { Observable } from "rxjs";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SharedService } from "src/shared.service";
import { v4 as uuidv4 } from 'uuid';
import IMask from "imask";

/**
 * Credit Card Component
 */
@Component({
  selector: "app-creditcard",
  templateUrl: "./creditcard.component.html",
  styleUrls: ["./creditcard.component.css"],
})
export class CreditcardComponent implements OnInit {
  addcreditcard!: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  creditArray: creditcard[] | null = null;
  uid: any;
  kid: string = '';
 /**
   * Constructor
   * @param http HttpClient
   * @param router Router
   * @param fb FormBuilder
   * @param sharedService SharedService
   */
  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private sharedService: SharedService,

  ) {
    this.bsConfig = {
      containerClass: 'theme-default',
      dateInputFormat: 'MM/YYYY'
    };
    this.kid = uuidv4();
  }
  getCurrentMonthYear(): string {
    const today = new Date();
    const year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString();
  
    if (month.length === 1) {
      month = '0' + month;
    }
  
    return `${year}-${month}`;
  }
/**
   * OnInit lifecycle hook
   */
  ngOnInit(): void {
    const logindata = localStorage.getItem("logindata");
    const uid = logindata ? JSON.parse(logindata).uid : "";   
    this.addcreditcard = this.fb.group({
      CCNo: ['', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/)]],
      CCName: ["", Validators.required],
      CCExp: ['MM/YYYY', Validators.required],
      Bname: [""],
      Cvvnum: ["", [Validators.required, Validators.pattern(/^\d{3}$/)]],
      Act: ["", Validators.required],
      NName: ["", Validators.required],
      uid: [uid, Validators.required],
      id : [this.kid,Validators.required],
      CCType: ["",Validators.required]
    });

    this.sharedService
      .getCreditCardArray()
      .subscribe((creditArray: creditcard[] | null) => {
        this.creditArray = creditArray;
        if (this.creditArray) {
          const formValues = {
            uid: uid
          };
          this.addcreditcard.patchValue(formValues);
        }
        console.log("update details component ",this.addcreditcard);
      });
  }
/**
   * Gets users from the server
   * @returns Observable of creditcard[]
   */
  private getUsers(): Observable<creditcard[]> {
    return this.http.get<creditcard[]>("http://localhost:3000/addcreditcard");
  }
  /**
   * @description addcc() function store data and update data into addcreditcard array locally and json-server
   * Adds a credit card
   */

  addcc(): void {
    if (this.addcreditcard.valid) {
      const { CCNo, CCName, CCExp, Bname, Cvvnum, Act, NName, uid,id,CCType } = this.addcreditcard.value;

      const newCreditcard: creditcard = {
        CCNo,
        CCName,
        CCExp,
        Bname,
        Cvvnum,
        Act,
        NName,
        uid,
        id,
        CCType
      };

      this.http
        .post("http://localhost:3000/addcreditcard", newCreditcard)
        .subscribe(
          (response) => {
            console.log("Data added:", response);
          },
          (error) => {
            console.log("credit data",newCreditcard);
            const localStorageData = localStorage.getItem("data");
            if (localStorageData) {
              const parsedData = JSON.parse(localStorageData);
              const creditCardArray = parsedData.addcreditcard || [];
              creditCardArray.push(newCreditcard);
              parsedData.addcreditcard = creditCardArray;
              localStorage.setItem("data", JSON.stringify(parsedData));
              this.router.navigate([`card/${newCreditcard.uid}`]);      
             }
            console.error("Error adding data:", error);
          }
        );
    }
  }
  applyCreditCardMask(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const maskOptions = {
      mask: '0000 0000 0000 00',
    };
    IMask(inputElement, maskOptions);
}
}