import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { creditcard } from "creditcard.interface";
import { Observable } from "rxjs";

@Component({
  selector: "app-creditcard",
  templateUrl: "./creditcard.component.html",
  styleUrls: ["./creditcard.component.css"],
})
export class CreditcardComponent implements OnInit {
  addcreditcard!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addcreditcard = this.fb.group({
      CCNo: ["", Validators.required],
      CCName: ["", Validators.required],
      CCExp: ["", Validators.required],
      Bname: ["", Validators.required],
      Cvvnum: ["", Validators.required],
      Act: ["", Validators.required],
      NName: ["", Validators.required],
      uid: ["",Validators.required]
    });
  }

  private getUsers(): Observable<creditcard[]> {
    return this.http.get<creditcard[]>("http://localhost:3000/addcreditcard");
  }

  addcc(): void {
    if (this.addcreditcard.valid) {
      const { CCNo, CCName, CCExp, Bname, Cvvnum, id, Act, NName, uid,CCType} =
        this.addcreditcard.value;

      const newCreditcard: creditcard = {
        CCNo,
        CCName,
        CCExp,
        Bname,
        Cvvnum,
        id,
        Act,
        NName,
        uid,
        CCType
      };

      this.http
        .post("http://localhost:3000/addcreditcard", newCreditcard)
        .subscribe(
          (response) => {
            console.log("Data added:", response);
          },
          (error) => {
            const localStorageData = localStorage.getItem("data");
            if (localStorageData) {
              const parsedData = JSON.parse(localStorageData);
              const creditCardArray = parsedData.addcreditcard || [];
              creditCardArray.push(newCreditcard);
              parsedData.addcreditcard = creditCardArray;
              localStorage.setItem("data", JSON.stringify(parsedData));
            }
            console.error("Error adding data:", error);

          }
        );
    }
  }
}
