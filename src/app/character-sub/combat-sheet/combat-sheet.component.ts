import { Component, OnInit, OnDestroy } from "@angular/core";
import { Character, CombatSheet, Ability, InventoryItem } from "../../character/character.models";
import { CharacterService } from "../../character/character.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorService } from "../../error-service.service";

@Component({
  selector: "app-combat-sheet",
  templateUrl: "./combat-sheet.component.html",
  styleUrls: ["./combat-sheet.component.scss"]
})
export class CombatSheetComponent implements OnInit, OnDestroy {
  characterSub: any;
  character: Character;
  charId: number;

  currentSheetIndex: number;
  currentSheet: CombatSheet;

  actionsEnabled = true;
  abilitiesVisible = false;

  abilitiesOnCooldown: Ability[] = [];

  constructor(private characterService: CharacterService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  loadCharacter() {
    this.characterService.getCharacterById(this.charId).then(
      (char: Character) => {
        this.character = char;
        this.currentSheet = char.combatSheets[this.currentSheetIndex];
        console.log("Loaded sheet", this.currentSheet);
      }
    );
  }

  ngOnInit() {
    this.charId = +this.route.parent.snapshot.params["id"];
    this.currentSheetIndex = +this.route.snapshot.params["sheetId"];
    this.loadCharacter();
    this.characterSub = this.characterService.characterUpdatesReceived.subscribe(
      () => {
        this.loadCharacter();
      }
    );
  }

  setInitiative() {
    const ini = +prompt("What is your initiative roll?");
    if (ini && !isNaN(ini) && ini >= 0 && ini <= 10) {
      this.currentSheet.initiative = ini;
      this.onSaveCharacter();
    } else {
      this.errorService.displayError("Not a valid initiative roll!");
    }
  }

  toggleAutoRoll() {
    this.currentSheet.autoRoll = !this.currentSheet.autoRoll;
    this.onSaveCharacter();
  }

  showAbilities() {
    this.abilitiesVisible = true;
  }

  castAbility(ability: Ability) {
    // The ability is now casting for the last time
    if (this.abilityOutOfUses(ability)) {
      this.abilitiesOnCooldown.push(ability);
    }

    // Add roll data
    if (this.currentSheet.autoRoll) {
      this.currentSheet.actions.push({
        type: "ability",
        abilityName: ability.name,
        rolls: {
          toHitRoll: this.rollDice(20),
          locationRoll: this.rollDice(20),
          damageRoll: this.rollDice(20)
        }
      });
    } else {
      // Skip roll data
      this.currentSheet.actions.push({
        type: "ability",
        abilityName: ability.name
      });
    }
  }

  useConsumable(consumable: InventoryItem) {
    // Subtract a use from the item
    consumable.amount--;
    const itemIndex = this.character.inventory.findIndex(item => item.name === consumable.name);

    this.currentSheet.actions.push({
      type: "item",
      itemName: consumable.name
    });

    if (consumable.amount === 0) {
      this.characterService.deleteInventoryItem(this.charId, itemIndex);
    }
  }

  abilityOutOfUses(ability: Ability) {
    let amountOfCasts = 0;

    this.currentSheet.actions.map((action) => {
      if (action["ability"]) {
        if (action["ability"]["name"] === ability.name) {
          amountOfCasts++;
        }
      }
    });

    return amountOfCasts >= ability.usesPerTurn ? true : false;
  }

  clearWounds() {
    if (confirm("Are you sure you want to clear your wounds?")) {
      this.currentSheet.wounds = [];
      this.onSaveCharacter();
    }
  }

  ngOnDestroy() {
    this.characterSub.unsubscribe();
  }

  onSaveCharacter() {
    this.character.combatSheets[this.currentSheetIndex] = this.currentSheet;
    this.characterService.updateCharacterById(this.charId, this.character);
  }

  rollDice(number: number) {
    return Math.floor(Math.random() * (number - 1 + 1)) + 1;
  }
}
