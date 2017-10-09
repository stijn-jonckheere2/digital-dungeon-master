import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { CharacterService } from "../character.service";
import { Character } from "../character.models";

@Component({
  selector: "app-character-edit",
  templateUrl: "./character-edit.component.html",
  styleUrls: ["./character-edit.component.scss"]
})
export class CharacterEditComponent implements OnInit, OnDestroy {
  characterSub: any;
  character: Character;
  charId: number;

  constructor(private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  loadCharacter() {
    this.characterService.getCharacterByIdForEdit(this.charId).then(
      (char: Character) => this.character = char
    );
  }

  ngOnInit() {
    this.charId = +this.route.snapshot.params["id"];
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

  onSaveCharacter() {
    this.characterService.updateCharacterById(this.charId, this.character);
    this.router.navigate(["/characters"]);
  }

}
