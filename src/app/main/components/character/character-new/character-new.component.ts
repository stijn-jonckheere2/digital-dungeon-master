import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CharacterService } from "../../../../shared/services";
import { Character } from "../../../../shared/models";

@Component({
  selector: "app-character-new",
  templateUrl: "./character-new.component.html",
  styleUrls: ["./character-new.component.scss"]
})
export class CharacterNewComponent implements OnInit {

  character = new Character("", "", "", 1, "", 1);

  constructor(private characterService: CharacterService,
    private router: Router) { }

  ngOnInit() {
  }

  onSaveCharacter() {
    this.characterService.addCharacter(this.character);
    this.router.navigate(["/characters"]);
  }

  onCancel() {
    this.router.navigate(["/characters"]);
  }

}
