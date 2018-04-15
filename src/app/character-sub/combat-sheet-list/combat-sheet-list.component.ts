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
  newSheet = new CombatSheet("", true);
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

  enableCopySheet(sheetIndex: number) {
    const sheet = this.character.combatSheets[sheetIndex];
    this.sheetFormEnabled = true;
    this.newSheet.wounds = sheet.wounds;
    this.newSheet.name = sheet.name + " (continued)";
    this.newSheet.autoRoll = sheet.autoRoll;
    this.newSheet.initiative = sheet.initiative;
  }

  addSheet() {
    if (this.newSheet.name.length === 0) {
      this.errorService.displayError("Sheet name can't be empty!");
    } else if (this.newSheet.initiative && (this.newSheet.initiative > 10 || this.newSheet.initiative < 1)) {
      this.errorService.displayError("Initiative must be between 1 and 10!");
    }  else if (!this.newSheet.autoRoll && !this.newSheet.initiative) {
      this.errorService.displayError("Initiative can't be empty!");
    } else {
      if (this.newSheetId >= 0) {
        this.characterService.updateCombatSheet(this.characterId, this.newSheetId, this.newSheet);
      } else {
        if (this.newSheet.autoRoll) {
          this.newSheet.initiative = this.rollDice(10);
        }
        this.characterService.addCombatSheet(this.characterId, this.newSheet);
      }
      this.newSheet = new CombatSheet("", true);
      this.newSheetId = -1;
      this.sheetFormEnabled = false;
      this.updateSheets();
    }
  }

  cancelAddSheet() {
    this.newSheet = new CombatSheet("", true);
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
    this.router.navigate([sheetId], { relativeTo: this.route });
  }

  rollDice(number: number) {
    return Math.floor(Math.random() * (number - 1 + 1)) + 1;
  }

}
