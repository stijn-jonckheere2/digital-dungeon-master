import { Router } from "@angular/router";
import * as firebase from "firebase";
import { environment } from "../../environments/environment";

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

  setAuthPersistence() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(function (error) {
        this.errorService.displayError(error.message);
      });
  }

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

            localStorage.setItem(environment.localStorageUser, this.userId);
            localStorage.setItem(environment.localStorageToken, this.token);

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
        localStorage.setItem(environment.localStorageUser, user.uid);
        firebase.auth().currentUser.getIdToken(true).then(
          (token) => {
            localStorage.setItem(environment.localStorageToken, token);
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

        localStorage.removeItem(environment.localStorageUser);
        localStorage.removeItem(environment.localStorageToken);
        this.router.navigate(["/login"]);
      }
    );
  }

  getUserId() {
    const user = localStorage.getItem(environment.localStorageUser);
    return user;
  }

  getToken() {
    const token = localStorage.getItem(environment.localStorageToken);
    return token;
  }

  isAuthenticated() {
    if (localStorage.getItem(environment.localStorageToken)) {
      return true;
    }
    return false;
  }
}
