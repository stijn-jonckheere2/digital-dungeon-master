import { Injectable } from "@angular/core";
import { ErrorService } from "../../shared/services";
import { Http } from "@angular/http";
import { AuthService } from "../../auth/services";
import { environment } from "../../../environments/environment";

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
        const url = environment.database.databaseURL + "/playernotes/" + userId + "-notes.json";

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
    const url = environment.database.databaseURL + "/playernotes/" + userId + "-notes.json";
    this.playerNotes = notes;

    this.http.put(url, [notes]).subscribe(
      (response) => { console.log("Player notes saved succesfully!"); },
      (error) => {
        this.errorService.displayError("Saving player notes failed! => " + error);
      }
    );
  }

}
