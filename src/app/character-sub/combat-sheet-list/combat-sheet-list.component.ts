import { Component, OnInit, OnDestroy } from "@angular/core";
import { Character, CombatSheet } from "../../character/character.models";
import { CharacterService } from "../../character/character.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorService } from "../../error-service.service";

@Component({
  selector: "app-combat-sheet-list",
  templateUrl: "./combat-sheet-list.component.html",
  styleUrls: ["./combat-sheet-list.component.scss"]
})
export class CombatSheetListComponent implements OnInit, OnDestroy {
  character: Character;
  characterSub: any;
  characterId: number;

  sheetFormEnabled = false;
  newSheet = new CombatSheet("", false);
  newSheetId = -1;

  constructor(private characterService: CharacterService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router) {
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
        this.handleForm();
      }
    );
  }

  handleForm() {
    if (!this.character.combatSheets || this.character.combatSheets.length === 0) {
      this.sheetFormEnabled = true;
    }
  }

  updateSheets() {
    this.character.combatSheets = this.characterService.getCombatSheets(this.characterId);
  }

  enableAddSheet() {
    this.sheetFormEnabled = true;
  }

  addSheet() {
    if (this.newSheet.name.length === 0) {
      this.errorService.displayError("Sheet name can't be empty!");
    } else {
      if (this.newSheetId >= 0) {
        this.characterService.updateCombatSheet(this.characterId, this.newSheetId, this.newSheet);
      } else {
        this.characterService.addCombatSheet(this.characterId, this.newSheet);
      }
      this.newSheet = new CombatSheet("", false);
      this.newSheetId = -1;
      this.sheetFormEnabled = false;
      this.updateSheets();
    }
  }

  cancelAddSheet() {
    this.newSheet = new CombatSheet("", false);
    this.newSheetId = -1;
    this.sheetFormEnabled = false;
  }

  editSheet(sheetId: number, sheet: CombatSheet) {
    this.newSheet = sheet;
    this.sheetFormEnabled = true;
    this.newSheetId = sheetId;
  }

  removeSheet(sheetId: number) {
    if (confirm("Are you sure you want to delete this combat sheet?")) {
      this.characterService.deleteCombatSheet(this.characterId, sheetId);
      this.updateSheets();
    }
  }

  onSelectSheet(sheetId: any) {
    this.router.navigate([sheetId], {relativeTo: this.route});
  }

}
