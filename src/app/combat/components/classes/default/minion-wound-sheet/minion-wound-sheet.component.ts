import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Character, CombatWound, MinionWoundSheet, CombatSheet } from '../../../../../shared/models';
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

    woundFormVisible = false;

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

    addWound() {
        this.formType = 'add';
        this.formWounds = [];
        this.woundFormVisible = true;
    }

    woundAdded(wound: CombatWound) {
        this.currentMinionSheet.wounds.push(wound);
        this.recalculateWounds();
    }

    lowerWound() {
        this.formType = 'lower';
        this.formWounds = this.currentMinionSheet.wounds.filter((w) => {
            if (w.severity !== 'SCR') {
                return w;
            }
        });
        this.woundFormVisible = true;
    }

    woundLowered(wound: CombatWound) {
        const woundIndex = this.currentMinionSheet.wounds.findIndex(w => w.location === wound.location && w.severity === wound.severity);
        switch (this.currentMinionSheet.wounds[woundIndex].severity) {
            case 'FAT':
                this.currentMinionSheet.wounds.push(new CombatWound(wound.location, 'SW'), new CombatWound(wound.location, 'SW'));
                break;
            case 'SW':
                this.currentMinionSheet.wounds.push(new CombatWound(wound.location, 'LW'),
                    new CombatWound(wound.location, 'LW'));
                break;
            case 'LW':
                this.currentMinionSheet.wounds.push(new CombatWound(wound.location, 'SCR'),
                    new CombatWound(wound.location, 'SCR'));
                break;
        }
        this.currentMinionSheet.wounds.splice(woundIndex, 1);
        this.recalculateWounds();
    }

    removeWound() {
        this.formType = 'remove';
        this.formWounds = this.currentMinionSheet.wounds;
        this.woundFormVisible = true;
    }

    woundRemoved(wound: CombatWound) {
        const woundIndex = this.currentMinionSheet.wounds.findIndex(w => w.location === wound.location && w.severity === wound.severity);
        this.currentMinionSheet.wounds.splice(woundIndex, 1);
        this.recalculateWounds();
    }

    clearWounds() {
        if (confirm('Are you sure you want to clear your wounds?')) {
            this.currentMinionSheet.wounds = [];
            this.onSaveCharacter();
        }
    }

    woundFormCanceled() {
        this.formType = 'add';
        this.formWounds = [];
        this.woundFormVisible = false;
    }

    recalculateWounds() {
        this.woundFormVisible = false;
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
