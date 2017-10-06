import { Component, OnInit, OnDestroy } from "@angular/core";
import { Character, Npc } from "../character/character.models";
import { CharacterService } from "../character/character.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-npc",
  templateUrl: "./npc.component.html",
  styleUrls: ["./npc.component.scss"]
})
export class NpcComponent implements OnInit, OnDestroy {
  character: Character;
  characterId: number;
  characterSub: any;

  npcFormEnabled = false;
  newNpc = new Npc("", "");
  newNpcId = -1;

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
    if (!this.character.npcList || this.character.npcList.length === 0) {
      this.npcFormEnabled = true;
    }
  }

  updateNpcs() {
    this.character.npcList = this.characterService.getNpcs(this.characterId);
  }

  enableAddNpc() {
    this.npcFormEnabled = true;
  }

  saveNpc() {
    if (this.newNpcId >= 0) {
      this.characterService.updateNpc(this.characterId, this.newNpcId, this.newNpc);
    } else {
      this.characterService.addNpc(this.characterId, this.newNpc);
    }
    this.newNpc = new Npc("", "");
    this.npcFormEnabled = false;
    this.resetNpc();
    this.updateNpcs();
  }

  cancelAddNpc() {
    this.npcFormEnabled = false;
    this.resetNpc();
  }

  editNpc(npcId: number, npc: Npc) {
    this.newNpc = npc;
    this.npcFormEnabled = true;
    this.newNpcId = npcId;
  }

  removeNpc(npcId: number) {
    this.characterService.deleteNpc(this.characterId, npcId);
    this.updateNpcs();
  }

  resetNpc() {
    this.newNpc = new Npc("", "");
    this.newNpcId = -1;
  }

}
