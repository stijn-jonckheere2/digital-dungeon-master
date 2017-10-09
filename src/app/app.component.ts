import { Component, OnInit } from "@angular/core";
import * as firebase from "firebase";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "app";

  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyA8J2ryEam-6m4WAoM3k1CT75ylhQPUWLQ",
      authDomain: "digital-dungeon-master.firebaseapp.com"
    });
    this.authService.setAuthPersistence();
    this.authService.startAuthListening();
  }
}
