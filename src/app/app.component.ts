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
      apiKey: "AIzaSyBqhxlpbErCF557lZd0-0qsXPubgMZzC_4",
      authDomain: "digital-dungeon-master-dev.firebaseapp.com",
      databaseURL: "https://digital-dungeon-master-dev.firebaseio.com",
      projectId: "digital-dungeon-master-dev",
      storageBucket: "digital-dungeon-master-dev.appspot.com",
      messagingSenderId: "259994406067"
    });
    this.authService.startAuthListening();
  }
}
