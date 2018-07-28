import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Character, CombatSheet, Ability, CombatWound, InventoryItem, DraconicBloodKnightCombatSheet } from "../../../../../shared/models";
import { CharacterService, ErrorService } from "../../../../../shared/services";

@Component({
  selector: "app-combat-sheet-draconic-blood-knight",
  templateUrl: "./combat-sheet-draconic-blood-knight.component.html",
  styleUrls: ["./combat-sheet-draconic-blood-knight.component.scss"]
})
export class CombatSheetDraconicBloodKnightComponent implements OnInit, OnDestroy {
  characterSub: any;
  character: Character;
  charId: number;

  currentSheetIndex: number;
  currentSheet: CombatSheet;

  actionsEnabled = true;
  abilitiesVisible = false;
  itemsVisible = false;
  woundFormVisible = false;

  formWounds: CombatWound[] = [];
  formType = "add";

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
    if (confirm("Would you like to re-roll initiative?")) {
      const ini = this.rollDice(10);
      this.currentSheet.initiative = ini;
      this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
    }
  }

  toggleAutoRoll() {
    if (confirm("Would you like to toggle automatic dice rolling?")) {
      this.currentSheet.autoRoll = !this.currentSheet.autoRoll;
      this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
    }
  }

  // ABILITIES

  showAbilities() {
    this.abilitiesVisible = true;
  }

  castAbility(ability: Ability) {
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

    if (ability.hasStatusEffect) {
      this.addStatusEffect(ability.effect);
    }

    if (this.currentSheet.hasOwnProperty("bloodMarks")) {
      this.currentSheet["bloodMarks"] -= ability["bloodmarksPerUse"];
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

  // WOUNDS

  addWound() {
    this.formType = "add";
    this.formWounds = [];
    this.woundFormVisible = true;
  }

  woundAdded(wound: CombatWound) {
    this.currentSheet.wounds.push(wound);
    this.recalculateWounds();
  }

  lowerWound() {
    this.formType = "lower";
    this.formWounds = this.currentSheet.wounds.filter((w) => {
      if (w.severity !== "SCR") {
        return w;
      }
    });
    this.woundFormVisible = true;
  }

  woundLowered(wound: CombatWound) {
    const woundIndex = this.currentSheet.wounds.findIndex(w => w.location === wound.location && w.severity === wound.severity);
    switch (this.currentSheet.wounds[woundIndex].severity) {
      case "FAT":
        this.currentSheet.wounds.push(new CombatWound(wound.location, "SW"), new CombatWound(wound.location, "SW"));
        break;
      case "SW":
        this.currentSheet.wounds.push(new CombatWound(wound.location, "LW"),
          new CombatWound(wound.location, "LW"));
        break;
      case "LW":
        this.currentSheet.wounds.push(new CombatWound(wound.location, "SCR"),
          new CombatWound(wound.location, "SCR"));
        break;
    }
    this.currentSheet.wounds.splice(woundIndex, 1);
    this.recalculateWounds();
  }

  removeWound() {
    this.formType = "remove";
    this.formWounds = this.currentSheet.wounds;
    this.woundFormVisible = true;
  }

  woundRemoved(wound: CombatWound) {
    const woundIndex = this.currentSheet.wounds.findIndex(w => w.location === wound.location && w.severity === wound.severity);
    this.currentSheet.wounds.splice(woundIndex, 1);
    this.recalculateWounds();
  }

  clearWounds() {
    if (confirm("Are you sure you want to clear your wounds?")) {
      this.currentSheet.wounds = [];
      this.onSaveCharacter();
    }
  }

  woundFormCanceled() {
    this.formType = "add";
    this.formWounds = [];
    this.woundFormVisible = false;
  }

  recalculateWounds() {
    // Accumulate wounds

    //
    this.woundFormVisible = false;
    this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
  }

  // STATUS EFFECTS

  addStatusEffect(effect: any) {
    const effectIndex = this.currentSheet.statusEffects.findIndex(e => e.name === effect.name);
    if (effectIndex >= 0) {
      this.currentSheet.statusEffects[effectIndex].numberOfTurns = effect.numberOfTurns;
    } else {
      this.currentSheet.statusEffects.push(effect);
    }
  }

  updateStatusEffects() {
    if (confirm("Proceed to the next round?")) {
      this.currentSheet.statusEffects = this.currentSheet.statusEffects.filter((eff) => {
        if (eff.numberOfTurns > 1) {
          return eff;
        }
      });
      this.currentSheet.statusEffects.map((eff) => {
        eff.numberOfTurns--;
        return eff;
      });
      this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
    }
  }

  // CLASS SPECIFIC

  addBloodmarks() {
    const marks = +prompt("How many blood marks would you like to add?");
    if (marks && marks > 0 && !isNaN(marks)) {
      this.currentSheet["bloodMarks"] += marks;
      this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
    }
  }

  // OTHER

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
