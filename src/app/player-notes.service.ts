import { Injectable } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { ErrorService } from "./error-service.service";
import { Http } from "@angular/http";
import { environment } from "../environments/environment";

@Injectable()
export class PlayerNotesService {

  playerNotes: string;
  notesFetched = false;

  constructor(private authService: AuthService,
    private errorService: ErrorService,
    private http: Http) { }

  fetchAdminNotes() {
    const fetchPromise = new Promise(
      (resolve, reject) => {
        const userId = this.authService.getUserId();
        const token = this.authService.getToken();
        const url = environment.database.databaseURL + "/playernotes/" + userId + "-notes.json?auth=" + token;

        this.http.get(url).subscribe(
          (response) => {
            const notes = response.json();
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
    const token = this.authService.getToken();
    const url = environment.database.databaseURL + "/playernotes/" + userId + "-notes.json?auth=" + token;
    this.playerNotes = notes;

    this.http.put(url, [notes]).subscribe(
      (response) => { console.log("Player notes saved succesfully!"); },
      (error) => {
        this.errorService.displayError("Saving player notes failed! => " + error);
      }
    );
  }

}
