import { Injectable, EventEmitter } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { ErrorService } from "./error-service.service";
import { Http } from "@angular/http";
import { environment } from "../environments/environment";
import { StoryRecap } from "./character/character.models";
import * as firebase from "firebase";

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
        console.log("Fetching Recaps!" + new Date());

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
        console.log("Get Recaps Called" + new Date(), this.recapsFetched);
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
