import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { creditcard } from "creditcard.interface";
import { SharedService } from "src/shared.service";

@Component({
  selector: "app-updatecreditdetails",
  templateUrl: "./updatecreditdetails.component.html",
  styleUrls: ["./updatecreditdetails.component.css"],
})
export class UpdatecreditdetailsComponent implements OnInit {
  updatecreditcard!: FormGroup;
  creditArray: creditcard[] | null = null;
  uid: any;

  constructor(private sharedService: SharedService, private fb: FormBuilder,private router: Router) {}

  ngOnInit(): void {
    const logindata = localStorage.getItem("logindata");
    const uid = logindata ? JSON.parse(logindata).uid : "";   
     this.updatecreditcard = this.fb.group({
      CCNo: [this.creditArray ? this.creditArray[0].CCNo: "", Validators.required],
      CCName: [this.creditArray ? this.creditArray[0].CCName: "", Validators.required],
      CCExp: [this.creditArray ? this.creditArray[0].CCExp:"", Validators.required],
      Bname: [this.creditArray ? this.creditArray[0].Bname:"", Validators.required],
      Cvvnum: [this.creditArray ? this.creditArray[0].Cvvnum:"", Validators.required],
      id: [this.creditArray ? this.creditArray[0].id : "", Validators.required],
      uid: [uid,Validators.required],
      Act: [this.creditArray ? this.creditArray[0].Act:"",Validators.required],
      CCType: [this.creditArray ? this.creditArray[0].CCType:"",Validators.required]
    });
  

    this.sharedService
      .getCreditCardArray()
      .subscribe((creditArray: creditcard[] | null) => {
        this.creditArray = creditArray;
        if (this.creditArray) {
          const formValues = {
            CCNo: this.creditArray[0].CCNo,
            CCName: this.creditArray[0].CCName,
            CCExp: this.creditArray[0].CCExp,
            Bname: this.creditArray[0].Bname,
            Cvvnum: this.creditArray[0].Cvvnum,
            id: this.creditArray[0].id,
            uid: uid,
            Act: this.creditArray[0].Act,
            CCType: this.creditArray[0].CCType
          };
          this.updatecreditcard.patchValue(formValues);
        }
        console.log("update details component ",this.creditArray);
      });
  }
  

  updatecredit(e:Event): void {
    e.preventDefault();
    debugger;
    if (this.updatecreditcard.valid && this.creditArray) {
      const postData = this.updatecreditcard.value;
      const id = this.creditArray[0].id;

      const localStorageData = localStorage.getItem("data");
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        const updateCreditCards = parsedData.addcreditcard;

        const index = updateCreditCards.findIndex(
          (card: any) => card.id === id
        );

        if (index !== -1) {
          updateCreditCards[index] = { id, ...postData };

          localStorage.setItem("data", JSON.stringify(parsedData));
        }
      }

      this.sharedService.updateCreditCard({ id, ...postData });
      const logindata = localStorage.getItem("logindata");
      const uid = logindata ? JSON.parse(logindata).uid : "";
      this.router.navigate([`card/${uid}`]);
    }
  }
} 

