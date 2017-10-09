import { Component, OnInit, OnDestroy } from "@angular/core";
import { Character } from "../character/character.models";
import { CharacterService } from "../character/character.service";
import { ActivatedRoute } from "@angular/router";
import { ErrorService } from "../error-service.service";

@Component({
  selector: "app-profession-stats",
  templateUrl: "./profession-stats.component.html",
  styleUrls: ["./profession-stats.component.scss"]
})
export class ProfessionStatsComponent implements OnInit, OnDestroy {
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
      case "profession":
        this.character.professionStats[statIndex].level++;
        this.statLogs.push("Added 1 stat point to <" + this.character.professionStats[statIndex].name + ">");
        break;
    }
  }

  decrementStat(type: string, statIndex: number) {
    switch (type) {
      case "profession":
        this.character.professionStats[statIndex].level--;
        this.statLogs.push("Removed 1 stat point from <" + this.character.professionStats[statIndex].name + ">");
        break;
    }
  }

  setStat(statIndex, statName) {
    const newStatValue = parseInt(window.prompt("Enter a value for <" + statName + ">:"));
    if (typeof newStatValue === typeof 0 && newStatValue <= 20 && newStatValue >= 3) {
      this.character.professionStats[statIndex].level = newStatValue;
    } else {
      this.errorService.displayError("The stat value you entered for <" + statName + "> was not correct");
    }
  }


  enableEdit() {
    this.allowEdit = true;
  }

  onSave() {
    for (const log of this.statLogs) {
      this.character.addLog(log);
    }
    this.statLogs = [];
    this.characterService.updateCharacterById(this.characterId, this.character);
    this.allowEdit = false;
  }


}
