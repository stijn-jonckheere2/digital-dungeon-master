import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from '../environments/environment';
import { AuthService } from './auth/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  silentRenewal: any;

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

    this.silentRenewal = setInterval(() => {
      this.authService.renewSessionSilently();
    }, 900000);
  }

  ngOnDestroy(): void {
    if (this.silentRenewal) {
      clearInterval(this.silentRenewal);
    }
  }
}
