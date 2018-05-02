import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Ability, DraconicBloodKnightAbility } from "../../../../../shared/models";

@Component({
  selector: "app-ability-chooser-draconic-blood-knight",
  templateUrl: "./ability-chooser-draconic-blood-knight.component.html",
  styleUrls: ["./ability-chooser-draconic-blood-knight.component.scss"]
})
export class AbilityChooserDraconicBloodKnightComponent implements OnInit {
  @Input() abilities: DraconicBloodKnightAbility[];
  @Input() availableBloodmarks: number;
  @Input() actions: any[];

  @Output() abilitySelected = new EventEmitter<Ability>();
  @Output() abilityCanceled = new EventEmitter<null>();

  availableAbilities: Ability[] = [];

  constructor() { }

  ngOnInit() {
    this.availableAbilities = this.abilities.filter((ability) => {
      if(!ability.isFlavourAbility) {
        return ability;
      }
    });
  }

  castAbility(ability: Ability) {
    this.abilitySelected.emit(ability);
  }

  cancelAbility() {
    this.abilityCanceled.emit();
  }
}
