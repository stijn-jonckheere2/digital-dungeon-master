import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Character } from "../../../../shared/models";
import { CharacterService, ErrorService } from "../../../../shared/services";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"]
})
export class StatsComponent implements OnInit, OnDestroy {
  character: Character;
  characterId: number;
  allowEdit = false;
  characterSub: any;

  statLogs = [];

  constructor(private characterService: CharacterService, private errorService: ErrorService,
    private route: ActivatedRoute) {
  }

  loadCharacter() {
    this.characterService.getCharacterById(this.characterId).then(
      (char: Character) => this.character = char
    );
  }

  ngOnInit() {
    this.characterId = +this.route.parent.snapshot.params["id"];
    this.loadCharacter();
    this.characterSub = this.characterService.characterUpdatesReceived.subscribe(
      () => {
        this.loadCharacter();
      }
    );
  }

  ngOnDestroy() {
    this.characterSub.unsubscribe();
  }

  incrementStat(type: string, statIndex: number) {
    switch (type) {
      case "primary":
        this.character.primaryStats[statIndex].level++;
        this.statLogs.push("Added 1 stat point to <" + this.character.primaryStats[statIndex].name + ">");
        break;
      case "secondary":
        this.character.secondaryStats[statIndex].level++;
        this.statLogs.push("Added 1 stat point to <" + this.character.secondaryStats[statIndex].name + ">");
        break;
    }
  }

  decrementStat(type: string, statIndex: number) {
    switch (type) {
      case "primary":
        this.character.primaryStats[statIndex].level--;
        this.statLogs.push("Removed 1 stat point from <" + this.character.primaryStats[statIndex].name + ">");
        break;
      case "secondary":
        this.character.secondaryStats[statIndex].level--;
        this.statLogs.push("Removed 1 stat point from <" + this.character.secondaryStats[statIndex].name + ">");
        break;
    }
  }

  enableEdit() {
    this.allowEdit = true;
  }

  setStat(type: string, statIndex, statName) {
    // tslint:disable-next-line:radix
    const newStatValue = parseInt(window.prompt("Enter a value for <" + statName + ">:"));

    switch (type) {
      case "primary":
        if (typeof newStatValue === typeof 0 && newStatValue <= 20 && newStatValue >= 0) {
          this.character.primaryStats[statIndex].level = newStatValue;
        } else {
          this.errorService.displayError("The stat value you entered for <" + statName + "> was not correct");
        }
        break;
      case "secondary":
        if (typeof newStatValue === typeof 0 && newStatValue <= 20 && newStatValue >= 3) {
          this.character.secondaryStats[statIndex].level = newStatValue;
        } else {
          this.errorService.displayError("The stat value you entered for <" + statName + "> was not correct");
        }
        break;
    }


  }

  onSave() {
    for (const log of this.statLogs) {
      this.character.addLog(log, "statLog");
    }
    this.statLogs = [];
    this.characterService.updateCharacterById(this.characterId, this.character);
    this.allowEdit = false;
  }

}
