// tslint:disable:radix

import { Injectable } from '@angular/core';
import { ErrorService } from '../../shared/services';
import { AuthService } from '../../auth/services';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BalanceService {

  playerBalance: number;
  balanceFetched = false;

  constructor(private authService: AuthService,
              private errorService: ErrorService,
              private http: HttpClient) { }

  fetchPlayerBalance() {
    const fetchPromise = new Promise(
      (resolve, reject) => {
        const userId = this.authService.getUserId();
        const url = environment.database.databaseURL + '/playerbalance/' + userId + '-balance.json';

        this.http.get(url).subscribe(
          (response: any) => {
            const balance = response !== null ? response[0] : null;
            if (balance !== null) {
              this.playerBalance = parseInt(balance);
            }
            this.balanceFetched = true;
            resolve();
          },
          (error) => {
            this.errorService.displayError(error.json().error);
            reject(error);
          }
        );
      }
    );
    return fetchPromise;
  }

  getPlayerBalance() {
    const promise = new Promise(
      (resolve, reject) => {
        if (this.balanceFetched) {
          resolve(this.playerBalance);
        } else {
          this.fetchPlayerBalance().then(
            () => {
              resolve(this.playerBalance);
            }
          );
        }
      }
    );

    return promise;
  }

  saveBalance(balance: number) {
    const userId = this.authService.getUserId();
    const url = environment.database.databaseURL + '/playerbalance/' + userId + '-balance.json';
    this.playerBalance = balance;

    this.http.put(url, [balance]).subscribe(
      (response) => { console.log('Player balance saved succesfully!'); },
      (error) => {
        this.errorService.displayError('Saving player balance failed! Last balance was:' + balance);
      }
    );
  }

}
