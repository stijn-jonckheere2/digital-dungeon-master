import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Character, CombatWound, MinionWoundSheet, CombatSheet, WoundLocation } from '../../../../../shared/models';
import { CharacterService, ErrorService } from '../../../../../shared/services';

@Component({
    selector: 'app-minion-wound-sheet',
    templateUrl: './minion-wound-sheet.component.html',
    styleUrls: ['./minion-wound-sheet.component.scss']
})
export class MinionWoundSheetComponent implements OnInit, OnDestroy {
    characterSub: any;
    character: Character;
    charId: number;

    currentSheetIndex: number;
    currentSheet: CombatSheet;

    currentMinionSheetIndex: number;
    currentMinionSheet: MinionWoundSheet;

    formWounds: CombatWound[] = [];
    formType = 'add';

    constructor(private characterService: CharacterService,
                private errorService: ErrorService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.charId = +this.route.parent.snapshot.params.id;
        this.currentSheetIndex = +this.route.snapshot.params.sheetId;
        this.currentMinionSheetIndex = +this.route.snapshot.params.minionSheetId;

        this.loadCharacter();
        this.characterSub = this.characterService.characterUpdatesReceived.subscribe(
            () => {
                this.loadCharacter();
            }
        );
    }

    loadCharacter() {
        this.characterService.getCharacterById(this.charId).then(
            (char: Character) => {
                this.character = char;
                this.currentSheet = char.combatSheets[this.currentSheetIndex];
                this.currentMinionSheet = this.currentSheet.minionWoundSheets[this.currentMinionSheetIndex];
            }
        );
    }

    // WOUNDS

    onAddWound(wound: CombatWound) {
        this.currentMinionSheet.wounds.push(wound);
        this.recalculateWounds();
    }

    onRemoveWound(wound: CombatWound) {
        const woundIndex = this.currentMinionSheet.wounds.findIndex(w => w.location === wound.location && w.severity === wound.severity);
        this.currentMinionSheet.wounds.splice(woundIndex, 1);
        this.recalculateWounds();
    }

    onClearWounds(location: WoundLocation): void {
        this.currentMinionSheet.wounds = this.currentMinionSheet.wounds.filter((wound: CombatWound) => {
            return wound.location !== location;
        });
        this.recalculateWounds();
    }

    recalculateWounds() {
        this.currentSheet.minionWoundSheets[this.currentMinionSheetIndex] = this.currentMinionSheet;
        this.characterService.updateCombatSheet(this.charId, this.currentSheetIndex, this.currentSheet);
    }

    // OTHER

    ngOnDestroy() {
        if (this.characterSub) {
            this.characterSub.unsubscribe();
        }
    }

    onSaveCharacter() {
        this.character.combatSheets[this.currentSheetIndex] = this.currentSheet;
        this.characterService.updateCharacterById(this.charId, this.character);
    }

    backToCombatSheet() {
        this.router.navigate(['/characters', this.charId, 'combat-sheets', this.currentSheetIndex]);
    }
}
