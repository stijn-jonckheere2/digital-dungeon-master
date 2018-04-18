import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { StoryRecap } from "../../../../shared/models";
import { StoryRecapService } from "../../../services";
import { ErrorService } from "../../../../shared/services";
import { AuthService } from "../../../../auth/services";

@Component({
  selector: "app-story-recap",
  templateUrl: "./story-recap.component.html",
  styleUrls: ["./story-recap.component.scss"]
})
export class StoryRecapComponent implements OnInit, OnDestroy {

  selectedRecap: StoryRecap;
  recapEditEnabled = false;
  recaps: StoryRecap[] = [];
  recapsFetched = false;
  recapSub: any;

  constructor(private recapService: StoryRecapService,
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.loadRecaps();
    this.recapSub = this.recapService.recapUpdatesReceived.subscribe(
      () => {
        this.loadRecaps();
      }
    );
  }

  loadRecaps() {
    this.recapService.getRecaps().then(
      (recaps: StoryRecap[]) => {
        if (recaps !== null) {
          this.recaps = this.sort(recaps);
          console.log("Got recaps!", this.recaps);
        }
        this.recapEditEnabled = false;
        this.recapsFetched = true;
      }
    );
  }

  sort(recaps: StoryRecap[]) {
    return recaps.sort((a, b) => {
      return a.createdOn > b.createdOn ? -1 : 1;
    });
  }

  editRecap(recap: StoryRecap) {
    this.selectedRecap = recap;
    this.recapEditEnabled = true;
  }

  saveRecap() {
    this.recapService.updateRecap(this.selectedRecap);
    this.recapEditEnabled = false;
  }

  ngOnDestroy() {
    this.recapSub.unsubscribe();
  }

  numDaysBetween(d1, d2) {
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
  }

}
