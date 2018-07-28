import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Ability, ChaosMageAbility, ChaosMageAbilityType } from "../../../../../shared/models";

@Component({
  selector: "app-ability-chooser-chaos-mage",
  templateUrl: "./ability-chooser-chaos-mage.component.html",
  styleUrls: ["./ability-chooser-chaos-mage.component.scss"]
})
export class AbilityChooserChaosMageComponent implements OnInit {
  @Input() currentPain: number;
  @Input() abilities: Ability[];
  @Input() abilitiesOnCooldown: Ability[];
  @Input() actions: any[];

  @Output() abilitySelected = new EventEmitter<Ability>();
  @Output() abilityCanceled = new EventEmitter<null>();

  availableAbilities: Ability[] = [];
  abilityType = ChaosMageAbilityType;

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
  }

  castAbility(ability: Ability) {
    this.abilitySelected.emit(ability);
  }

  cancelAbility() {
    this.abilityCanceled.emit();
  }

  abilityUsesLeft(ability: Ability) {
    if(ability.usesPerTurn === 0) {
      return 0;
    }
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

  enoughPainFor(ability: ChaosMageAbility): boolean {
    return ability.amountOfPain && ability.amountOfPain <= this.currentPain;
  }

  wontKillYou(ability: ChaosMageAbility): boolean {
    return ability.amountOfPain && (ability.amountOfPain + this.currentPain) <= 19;
  }

}
