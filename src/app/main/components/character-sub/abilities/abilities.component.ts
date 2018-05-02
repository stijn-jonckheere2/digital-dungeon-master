import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Character, Ability, DraconicBloodKnightAbility } from "../../../../shared/models";
import { CharacterService, ErrorService } from "../../../../shared/services";

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
  newAbility = new Ability("", "", 1, 1, false, false, { name: "", numberOfTurns: 1 });
  newAbilityId = -1;

  constructor(private characterService: CharacterService,
    private errorService: ErrorService,
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
        this.updateNewAbility();
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
      if (this.newAbility.name.length === 0) {
        this.errorService.displayError("Ability name can't be empty!");
      } else {
        this.characterService.addAbility(this.characterId, this.newAbility);
      }
    }
    this.newAbility = new Ability("", "", 1, 1, false, false, { name: "", numberOfTurns: 1 });
    this.newAbilityId = -1;
    this.updateNewAbility();
    this.abilityFormEnabled = false;
    this.updateAbilities();
  }

  cancelAddAbility() {
    this.newAbility = new Ability("", "", 1, 1, false, false, { name: "", numberOfTurns: 1 });
    this.newAbilityId = -1;
    this.updateNewAbility();
    this.abilityFormEnabled = false;
  }

  editAbility(abilityId: number, ability: Ability) {
    this.newAbility = ability;
    this.abilityFormEnabled = true;
    this.newAbilityId = abilityId;
  }

  removeAbility(abilityId: number) {
    if (confirm("Are you sure you want to delete this ability?")) {
      this.characterService.deleteAbility(this.characterId, abilityId);
      this.updateAbilities();
    }
  }

  updateNewAbility() {
    switch (this.character.className) {
      case "Draconic Blood Knight":
        this.newAbility = Character.convertAbility(this.newAbility, "Draconic Blood Knight");
        break;
    }
  }

}
