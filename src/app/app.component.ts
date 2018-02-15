import { Component, OnInit } from "@angular/core";
import * as firebase from "firebase";
import { environment } from "../environments/environment";

import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "app";

  constructor(private authService: AuthService) {
    authService.handleAuthentication();
   }

  ngOnInit() {

    firebase.initializeApp({
      apiKey: environment.database.apiKey,
      authDomain: environment.database.authDomain,
      databaseURL: environment.database.databaseURL,
      projectId: environment.database.projectId,
      storageBucket: environment.database.storageBucket,
      messagingSenderId: environment.database.messagingSenderId
    });

  }
}
