import { Component, OnInit, Input } from "@angular/core";
import { CombatWound } from "../../character/character.models";

@Component({
  selector: "app-wound-selector",
  templateUrl: "./wound-selector.component.html",
  styleUrls: ["./wound-selector.component.scss"]
})
export class WoundSelectorComponent implements OnInit {
  @Input() wounds: CombatWound[];

  constructor() { }

  ngOnInit() {
  }

}
