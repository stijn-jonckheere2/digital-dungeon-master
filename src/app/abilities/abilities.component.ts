import { Component, OnInit, OnDestroy } from "@angular/core";
import { Character, Ability } from "../character/character.models";
import { CharacterService } from "../character/character.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-abilities",
  templateUrl: "./abilities.component.html",
  styleUrls: ["./abilities.component.scss"]
})
export class AbilitiesComponent implements OnInit, OnDestroy {
  character: Character;
  characterSub: any;
  characterId: number;

  abilityFormEnabled = false;
  newAbility = new Ability("", "", 1, false);
  newAbilityId = -1;

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
        this.handleForm();
      }
    );
  }

  handleForm() {
    if (!this.character.abilities || this.character.abilities.length === 0) {
      this.abilityFormEnabled = true;
    }
  }

  updateAbilities() {
    this.character.abilities = this.characterService.getAbilities(this.characterId);
  }

  enableAddAbility() {
    this.abilityFormEnabled = true;
  }

  addAbility() {
    if (this.newAbilityId >= 0) {
      this.characterService.updateAbility(this.characterId, this.newAbilityId, this.newAbility);
    } else {
      this.characterService.addAbility(this.characterId, this.newAbility);
    }
    this.newAbility = new Ability("", "", 1, false);
    this.newAbilityId = -1;
    this.abilityFormEnabled = false;
    this.updateAbilities();
  }

  cancelAddAbility() {
    this.newAbility = new Ability("", "", 1, false);
    this.newAbilityId = -1;
    this.abilityFormEnabled = false;
  }

  editAbility(abilityId: number, ability: Ability) {
    this.newAbility = ability;
    this.abilityFormEnabled = true;
    this.newAbilityId = abilityId;
  }

  removeAbility(abilityId: number) {
    this.characterService.deleteAbility(this.characterId, abilityId);
    this.updateAbilities();
  }

}
