import { Injectable, EventEmitter } from "@angular/core";
import { ErrorService } from "../../shared/services";
import { Http } from "@angular/http";
import * as firebase from "firebase";
import { StoryRecap } from "../../shared/models";
import { AuthService } from "../../auth/services";
import { environment } from "../../../environments/environment";

@Injectable()
export class StoryRecapService {

  recapDb: any;
  recapUpdatesReceived = new EventEmitter<null>();
  recaps: StoryRecap[] = [];
  recapsFetched = false;

  constructor(private authService: AuthService,
    private errorService: ErrorService,
    private http: Http) { }

  fetchCharacters() {
    const fetchPromise = new Promise(
      (resolve, reject) => {
        const userId = this.authService.getUserId();
        this.recapDb = firebase.database().ref().child("recaps");

        this.recapDb.on("value", snapshot => {
          if (snapshot.val() !== null) {
            this.convertCharacters(snapshot.val());
            this.recapUpdatesReceived.emit();
          }
          resolve();
        });
      }
    );
    return fetchPromise;
  }

  convertCharacters(recaps) {
    this.recaps = [];
    for (const prop in recaps) {
      if (recaps[prop]) {
        recaps[prop]["createdOn"] = new Date(recaps[prop]["createdOn"]);
        recaps[prop]["modifiedOn"] = new Date(recaps[prop]["modifiedOn"]);
        this.recaps.push(recaps[prop]);
      }
    }
    this.recapsFetched = true;
  }

  getRecaps() {
    const promise = new Promise(
      (resolve, reject) => {
        if (this.recapsFetched) {
          resolve(this.recaps);
        } else {
          this.fetchCharacters().then(
            () => {
              resolve(this.recaps);
            }
          );
        }
      }
    );

    return promise;
  }

  updateRecap(recap: StoryRecap) {
    recap.modifiedBy = this.authService.getUserId();
    recap.modifiedOn = new Date();
    this.saveRecap(recap);
  }

  saveRecap(recap: StoryRecap) {
    const url = environment.database.databaseURL + "/recaps/" + recap.id + "-recap.json";
    this.http.put(url, recap).subscribe(
      (response) => { console.log("Recap saved succesfully!" + new Date()); },
      (error) => {
        this.errorService.displayError("Save recap failed! => " + error);
      }
    );
  }

}
