import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';
import * as auth0 from 'auth0-js';
import * as jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment';

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
      this.handleAuthResult(authResult, err, true);
    });
  }

  public renewSessionSilently(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      this.handleAuthResult(authResult, err);
    });
  }

  handleAuthResult(authResult: any, error: any, navigation: boolean = false): void {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      this.setSession(authResult);
      this.authEvent.emit(true);
      if (navigation) {
        this.router.navigate(['/characters']);
      }
    } else if (error) {
      this.router.navigate(['/characters']);
      console.log(error);
    }
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    // Go back to the home route
    this.login();
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token"s expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const dateNow = new Date().getTime();
    return dateNow < expiresAt;
  }

  public getUserId(): string {
    const idToken = localStorage.getItem('id_token');
    const tokenData = jwt_decode(idToken);
    return tokenData.sub;
  }

  public getNonce(): string {
    const idToken = localStorage.getItem('id_token');
    const tokenData = jwt_decode(idToken);
    return tokenData.nonce;
  }
}
