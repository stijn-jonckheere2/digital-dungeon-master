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
      authDomain: "digital-dungeon-master.firebaseapp.com",
      databaseURL: "https://digital-dungeon-master.firebaseio.com",
      projectId: "digital-dungeon-master",
      storageBucket: "digital-dungeon-master.appspot.com",
      messagingSenderId: "165971576370"
    });
    this.authService.setAuthPersistence();
    this.authService.startAuthListening();
  }
}
