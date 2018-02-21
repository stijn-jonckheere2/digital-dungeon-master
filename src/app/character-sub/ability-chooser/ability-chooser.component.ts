import { Component, OnInit, Input } from "@angular/core";
import { Ability } from "../../character/character.models";

@Component({
  selector: "app-ability-chooser",
  templateUrl: "./ability-chooser.component.html",
  styleUrls: ["./ability-chooser.component.scss"]
})
export class AbilityChooserComponent implements OnInit {
  @Input() abilities: Ability[];
  @Input() abilitiesOnCooldown: Ability[];

  constructor() { }

  ngOnInit() {
  }

}
