import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PlayerNotesService } from "../../../services";
import { ErrorService } from "../../../../shared/services";

@Component({
  selector: "app-player-notes",
  templateUrl: "./player-notes.component.html",
  styleUrls: ["./player-notes.component.scss"]
})
export class PlayerNotesComponent implements OnInit {

  playerNotes = "";
  playerNotesFetched = false;
  noteEdit = false;

  constructor(private playerNotesService: PlayerNotesService,
    private router: Router,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.updateNotes();
  }

  editNotes() {
    this.noteEdit = true;
  }

  updateNotes() {
    this.playerNotesService.getPlayerNotes().then(
      (notes: string) => {
        if (notes !== null && notes !== undefined) {
          this.playerNotes = notes;
          this.noteEdit = notes.length === 0 ? true : false;
        } else {
          this.noteEdit = true;
        }
        this.playerNotesFetched = true;
      }
    );
  }

  saveNotes() {
    this.playerNotesService.saveNotes(this.playerNotes);
    this.noteEdit = false;
    this.updateNotes();
  }

}
