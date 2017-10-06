import { Router } from "@angular/router";
import * as firebase from "firebase";
import { Injectable, EventEmitter } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { ErrorService } from "../error-service.service";
import { CharacterService } from "../character/character.service";

@Injectable()
export class AuthService {
  token: string;
  userId: string;

  authChangedEvent = new EventEmitter<boolean>();
  firebaseAuthListener: any;

  constructor(private router: Router,
    private errorService: ErrorService) { }

  signupUser(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(
      () => this.signinUser(email, password)
      )
      .catch(
      error => this.errorService.displayError(error.message)
      );
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
      response => {
        firebase.auth().currentUser.getIdToken()
          .then(
          (token: string) => {
            this.token = token;
            this.userId = firebase.auth().currentUser.uid;
            this.authChangedEvent.emit(true);

            localStorage.setItem("digital-dungeon-master-dev-auth-user", this.userId);
            localStorage.setItem("digital-dungeon-master-dev-auth-token", this.token);

            this.router.navigate(["/characters"]);
          }
          );
      }
      )
      .catch(
      error => this.errorService.displayError(error.message)
      );
  }

  startAuthListening() {
    this.firebaseAuthListener = firebase.auth().onAuthStateChanged((user: any) => {
      if (user === null) {
        this.router.navigate(["/login"]);
        this.errorService.displayError("Your session has expired. Please login again.");
      } else {
        localStorage.setItem("digital-dungeon-master-dev-auth-user", user.uid);
        firebase.auth().currentUser.getIdToken(true).then(
          (token) => {
            localStorage.setItem("digital-dungeon-master-dev-auth-token", token);
          }
        );
      }
    });
  }

  logout() {
    firebase.auth().signOut().then(
      () => {
        this.token = null;
        this.authChangedEvent.emit(false);

        localStorage.removeItem("digital-dungeon-master-dev-auth-user");
        localStorage.removeItem("digital-dungeon-master-dev-auth-token");
        this.router.navigate(["/login"]);
      }
    );
  }

  getUserId() {
    const user = localStorage.getItem("digital-dungeon-master-dev-auth-user");
    return user;
  }

  getToken() {
    const token = localStorage.getItem("digital-dungeon-master-dev-auth-token");
    return token;
  }

  isAuthenticated() {
    if (localStorage.getItem("digital-dungeon-master-dev-auth-token")) {
      return true;
    }
    return false;
  }
}
