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
  itemsVisible = false;

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
        this.calculateCooldowns();
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

  rollInitiative() {
    const ini = this.rollDice(10);
    this.currentSheet.initiative = ini;
    this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
  }

  toggleAutoRoll() {
    this.currentSheet.autoRoll = !this.currentSheet.autoRoll;
    this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
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
      const rolls = [];
      for (let counter = 0; counter < ability.amountOfStrikes; counter++) {
        rolls.push({
          toHitRoll: this.rollDice(20),
          locationRoll: this.rollDice(20),
          damageRoll: this.rollDice(20)
        });
      }
      this.currentSheet.actions.unshift({
        type: "ability",
        abilityName: ability.name,
        rolls: rolls
      });
    } else {
      // Skip roll data
      this.currentSheet.actions.unshift({
        type: "ability",
        abilityName: ability.name
      });
    }

    this.cancelAbility();
    this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
  }

  cancelAbility() {
    this.abilitiesVisible = false;
  }

  showItems() {
    let amountOfConsumables = 0;

    this.character.inventory.map((it) => {
      if (it.consumable) {
        amountOfConsumables++;
      }
    });

    if (amountOfConsumables > 0) {
      this.itemsVisible = true;
    } else {
      this.errorService.displayError("You don't have any consumables!");
    }
  }

  cancelItem() {
    this.itemsVisible = false;
  }

  useConsumable(consumable: InventoryItem) {
    const itemIndex = this.character.inventory.findIndex(item => item.name === consumable.name);

    this.currentSheet.actions.unshift({
      type: "item",
      itemName: consumable.name
    });

    this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
    this.characterService.useInventoryItem(this.charId, itemIndex);

    this.cancelItem();
  }

  abilityOutOfUses(ability: Ability) {
    let amountOfCasts = 0;

    this.currentSheet.actions.map((action) => {
      if (action["ability"]) {
        if (action["abilityName"] === ability.name) {
          amountOfCasts++;
        }
      }
    });

    return amountOfCasts >= ability.usesPerTurn ? true : false;
  }

  calculateCooldowns() {
    if (this.currentSheet.actions.length === 0) {
      return;
    }
    this.abilitiesOnCooldown = [];
    const usedAbilities = {};

    for (const action of this.currentSheet.actions) {
      if (action["type"] === "ability") {
        if (usedAbilities[action["abilityName"]]) {
          usedAbilities[action["abilityName"]]++;
        } else {
          usedAbilities[action["abilityName"]] = 1;
        }
      }
    }

    for (const ability of this.character.abilities) {
      if (usedAbilities[ability["name"]] >= ability["usesPerTurn"]) {
        this.abilitiesOnCooldown.push(ability);
      }
    }

    console.log("Calculated Cooldowns", this.abilitiesOnCooldown, usedAbilities);
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
