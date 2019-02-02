import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '../../../../shared/models';
import { CharacterService, ErrorService } from '../../../../shared/services';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy {

  characters: Character[] = [];
  charactersFetched = false;
  characterSub: any;

  constructor(private characterService: CharacterService,
              private router: Router,
              private errorService: ErrorService) { }

  ngOnInit() {
    this.loadCharacters();
    this.characterSub = this.characterService.characterUpdatesReceived.subscribe(
      () => {
        this.loadCharacters();
      }
    );
  }

  ngOnDestroy() {
    this.characterSub.unsubscribe();
  }

  loadCharacters() {
    this.characterService.getCharacters().then(
      (characters: Character[]) => {
        if (characters !== null) {
          this.characters = characters;
        }
        this.charactersFetched = true;
      }
    );
  }

  onSave() {
    this.characterService.saveCharacters(this.characters).subscribe(
      () => { },
      (error) => { this.errorService.displayError(error.json().error); },
    );
  }

  onNewCharacter() {
    this.router.navigate(['/characters', 'create', 'new']);
  }

  onSelectCharacter(charId: number) {
    this.characterService.setCharacterSelected(charId);
    this.router.navigate(['/characters', charId, 'stats']);
  }

  onDeleteCharacter(id: number) {
    this.characterService.deleteCharacter(id);
  }

}
