import { Component, OnInit } from "@angular/core";
import { Quest, Character } from "../character/character.models";
import { CharacterService } from "../character/character.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-questlog",
  templateUrl: "./questlog.component.html",
  styleUrls: ["./questlog.component.scss"]
})
export class QuestlogComponent implements OnInit {
  character: Character;
  characterId: number;
  completedVisible = false;

  questFormEnabled = false;
  newQuest = new Quest("", "", false);
  newQuestId = -1;

  activeQuestLog: Quest[] = [];
  completedQuestLog: Quest[] = [];

  constructor(private characterService: CharacterService,
    private route: ActivatedRoute) {
  }

  loadCharacter() {
    this.characterService.getCharacterById(this.characterId).then(
      (char: Character) => {
        this.character = char;
        this.handleForm();
      }
    );
  }

  ngOnInit() {
    this.characterId = +this.route.parent.snapshot.params["id"];
    this.loadCharacter();
  }

  handleForm() {
    if (!this.character.questLog || this.character.questLog.length === 0) {
      this.questFormEnabled = true;
    } else {
      this.updateActiveQuests();
    }
  }

  toggleCompleted() {
    this.completedVisible = !this.completedVisible;
  }

  updateQuests() {
    this.character.questLog = this.characterService.getQuests(this.characterId);
    this.updateActiveQuests();
  }

  updateActiveQuests() {
    this.activeQuestLog = this.character.getQuests();
    this.completedQuestLog = this.character.getCompletedQuests();
  }

  enableAddQuest() {
    this.questFormEnabled = true;
  }

  saveQuest() {
    if (this.newQuestId >= 0) {
      this.characterService.updateQuest(this.characterId, this.newQuestId, this.newQuest);
    } else {
      this.characterService.addQuest(this.characterId, this.newQuest);
    }
    this.newQuest = new Quest("", "", false);
    this.questFormEnabled = false;
    this.resetQuest();
    this.updateQuests();
  }

  cancelAddQuest() {
    this.questFormEnabled = false;
    this.resetQuest();
  }

  editQuest(questId: number, quest: Quest) {
    this.newQuest = quest;
    this.questFormEnabled = true;
    this.newQuestId = questId;
  }

  removeQuest(npcId: number) {
    this.characterService.deleteQuest(this.characterId, npcId);
    this.updateQuests();
  }

  resetQuest() {
    this.newQuest = new Quest("", "", false);
    this.newQuestId = -1;
  }

}
