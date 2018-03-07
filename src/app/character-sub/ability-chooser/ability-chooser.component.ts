import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Ability } from "../../character/character.models";

@Component({
  selector: "app-ability-chooser",
  templateUrl: "./ability-chooser.component.html",
  styleUrls: ["./ability-chooser.component.scss"]
})
export class AbilityChooserComponent implements OnInit {
  @Input() abilities: Ability[];
  @Input() abilitiesOnCooldown: Ability[];
  @Input() actions: any[];

  @Output() abilitySelected = new EventEmitter<Ability>();
  @Output() abilityCanceled = new EventEmitter<null>();

  availableAbilities: Ability[] = [];

  constructor() { }

  ngOnInit() {
    this.filterAbilities();
  }

  filterAbilities() {
    for (const ab of this.abilities) {
      const cdIndex = this.abilitiesOnCooldown.findIndex(abi => abi.name === ab.name);
      if (cdIndex === -1) {
        this.availableAbilities.push(ab);
      }
    }
    this.availableAbilities = this.availableAbilities.filter((ab) => {
      if(!ab.isFlavourAbility) {
        return ab;
      }
    });
    console.log("Filtered abilities", this.availableAbilities);
  }

  castAbility(ability: Ability) {
    this.abilitySelected.emit(ability);
  }

  cancelAbility() {
    this.abilityCanceled.emit();
  }

  abilityUsesLeft(ability: Ability) {
    let amountOfCasts = 0;

    this.actions.map((action) => {
      if (action["type"] === "ability") {
        if (action["abilityName"] === ability.name) {
          amountOfCasts++;
        }
      }
    });

    return ability.usesPerTurn - amountOfCasts;
  }

}
