import { Component, OnInit, OnDestroy } from "@angular/core";
import { Character } from "../character.models";
import { CharacterService } from "../character.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-character-logs",
  templateUrl: "./character-logs.component.html",
  styleUrls: ["./character-logs.component.scss"]
})
export class CharacterLogsComponent implements OnInit, OnDestroy {
  character: Character;
  characterId: number;
  characterSub: any;
  logLimit = 5;
  logsAvailable = true;
  logType = "all";

  constructor(private characterService: CharacterService,
    private route: ActivatedRoute) {
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

  loadCharacter() {
    this.characterService.getCharacterById(this.characterId).then(
      (char: Character) => {
        this.character = char;
      }
    );
  }

  clearLogs() {
    this.character.clearLogs();
    this.characterService.updateCharacterById(this.characterId, this.character);
  }

  loadMoreLogs() {
    if ((this.logLimit + 5) <= this.character.logs.length) {
      this.logLimit += 5;
    } else {
      this.logLimit = this.character.logs.length;
      this.logsAvailable = false;
    }
  }

}
