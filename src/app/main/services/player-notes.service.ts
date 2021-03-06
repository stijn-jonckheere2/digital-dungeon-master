import { Injectable } from '@angular/core';
import { ErrorService } from '../../shared/services';
import { AuthService } from '../../auth/services';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PlayerNotesService {

  playerNotes: string;
  notesFetched = false;

  constructor(private authService: AuthService,
              private errorService: ErrorService,
              private http: HttpClient) { }

  fetchAdminNotes() {
    const fetchPromise = new Promise(
      (resolve, reject) => {
        const userId = this.authService.getUserId();
        const url = environment.database.databaseURL + '/playernotes/' + userId + '-notes.json';

        this.http.get(url).subscribe(
          (response: any) => {
            const notes = response !== null ? response[0] : null;
            if (notes !== null) {
              this.playerNotes = notes;
            }
            this.notesFetched = true;
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

  getPlayerNotes() {
    const promise = new Promise(
      (resolve, reject) => {
        if (this.notesFetched) {
          resolve(this.playerNotes);
        } else {
          this.fetchAdminNotes().then(
            () => {
              resolve(this.playerNotes);
            }
          );
        }
      }
    );

    return promise;
  }

  saveNotes(notes: string) {
    const userId = this.authService.getUserId();
    const url = environment.database.databaseURL + '/playernotes/' + userId + '-notes.json';
    this.playerNotes = notes;

    this.http.put(url, [notes]).subscribe(
      (response) => { console.log('Player notes saved succesfully!'); },
      (error) => {
        this.errorService.displayError('Saving player notes failed! => ' + error);
      }
    );
  }

}
