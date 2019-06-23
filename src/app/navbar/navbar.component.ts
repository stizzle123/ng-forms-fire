import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  isToggled: boolean = false;
  constructor() {}

  ngOnInit() {}

  toggle(ham: HTMLElement) {
    this.isToggled = !this.isToggled;
    ham.classList.toggle("is-active");
  }
}
