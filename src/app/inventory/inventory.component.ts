import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Character, InventoryItem } from "../character/character.models";
import { CharacterService } from "../character/character.service";


@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"]
})
export class InventoryComponent implements OnInit, OnDestroy {
  character: Character;
  characterId: number;
  characterSub: any;

  itemFormEnabled = false;
  newInventoryItem = new InventoryItem("", "", 1, false);
  newItemId = -1;

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

  updateInventory() {
    this.character.inventory = this.characterService.getInventory(this.characterId);
  }

  enableAddItem() {
    this.itemFormEnabled = true;
  }

  addItem() {
    if (this.newItemId >= 0) {
      this.characterService.updateInventoryItem(this.characterId, this.newItemId, this.newInventoryItem);
    } else {
      this.characterService.addInventoryItem(this.characterId, this.newInventoryItem);
    }

    this.newInventoryItem = new InventoryItem("", "", 1, false);
    this.newItemId = -1;
    this.itemFormEnabled = false;
    this.updateInventory();
  }

  editItem(itemId: number) {
    this.newInventoryItem = this.character.inventory[itemId];
    this.newItemId = itemId;
    this.itemFormEnabled = true;
  }

  cancelAddItem() {
    this.newInventoryItem = new InventoryItem("", "", 1, false);
    this.itemFormEnabled = false;
  }

  useItem(itemId: number) {
    this.characterService.useInventoryItem(this.characterId, itemId);
    this.updateInventory();
  }

  removeItem(itemId: number) {
    this.characterService.deleteInventoryItem(this.characterId, itemId);
    this.updateInventory();
  }

  addGold(amount: number) {
    this.characterService.addGold(this.characterId, amount);
    this.characterService.updateCharacterById(this.characterId, this.character);
  }

  reduceGold(amount: number) {
    this.characterService.reduceGold(this.characterId, amount);
    this.characterService.updateCharacterById(this.characterId, this.character);
  }
}
