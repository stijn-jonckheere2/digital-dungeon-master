import { Router } from "@angular/router";
import * as firebase from "firebase";
import { environment } from "../../environments/environment";

import { Injectable, EventEmitter } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { ErrorService } from "../error-service.service";
import { CharacterService } from "../character/character.service";
import "rxjs/add/operator/filter";
import * as auth0 from "auth0-js";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth(environment.authZero);

  constructor(public router: Router) { }

  public authEvent = new EventEmitter<boolean>();

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = "";
        this.setSession(authResult);
        this.authEvent.emit(true);
        this.router.navigate(["/characters"]);
      } else if (err) {
        this.router.navigate(["/characters"]);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");

    // Go back to the home route
    this.login();
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token"s expiry time
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }

  public getUserId(): string {
    const idToken = localStorage.getItem("id_token");
    const tokenData = jwt_decode(idToken);
    return tokenData.sub;
  }

}
