import { Component } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  Testing() {
    var name = $("#txtName").val();
    alert(name)
  }

}
