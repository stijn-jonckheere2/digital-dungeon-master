import { Injectable, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { Character, InventoryItem, Npc, Quest, Ability, CombatSheet } from '../models';
import { AuthService } from '../../auth/services';
import { ErrorService } from './error-service.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CharacterService {

    characters: Character[] = [];
    charactersFetched = false;
    characterSelection = new EventEmitter<number>();
    characterUpdatesReceived = new EventEmitter<null>();
    characterDb: any;

    constructor(private authService: AuthService,
                private http: HttpClient,
                private errorService: ErrorService) {
    }

    // Service Methods
    setCharacterSelected(charId: number) {
        this.characterSelection.emit(charId);
    }

    unsetCharacterSelected() {
        this.characterSelection.emit(-1);
    }

    // Character Methods
    saveCharacters(characters: Character[]) {
        const userId = this.authService.getUserId();
        const url = environment.database.databaseURL + '/characters/' + userId + '-characters.json';
        return this.http.put(url, this.characters);
    }

    fetchCharacters() {
        const fetchPromise = new Promise(
            (resolve, reject) => {
                const userId = this.authService.getUserId();
                this.characterDb = firebase.database().ref().child('characters').child(userId + '-characters');

                this.characterDb.on('value', snapshot => {
                    if (snapshot.val() !== null) {
                        this.convertCharacters(snapshot.val());
                        this.characterUpdatesReceived.emit();
                    }
                    resolve();
                });
            }
        );
        return fetchPromise;
    }

    convertCharacters(characters) {
        this.characters = characters.map((char, index) => {
            return Character.fromJSON(char);
        });
        this.charactersFetched = true;
    }

    getCharacters() {
        const promise = new Promise(
            (resolve, reject) => {
                if (this.charactersFetched) {
                    resolve(this.characters);
                } else {
                    this.fetchCharacters().then(
                        () => {
                            resolve(this.characters);
                        }
                    );
                }
            }
        );

        return promise;
    }

    getCharacterById(id: number) {
        const promise = new Promise(
            (resolve, reject) => {
                if (this.charactersFetched) {
                    this.characterSelection.emit(id);
                    resolve(this.characters[id]);
                } else {
                    this.fetchCharacters().then(
                        () => {
                            this.characterSelection.emit(id);
                            resolve(this.characters[id]);
                        }
                    );
                }
            }
        );
        return promise;
    }

    getCharacterByIdForEdit(id: number) {
        const promise = new Promise(
            (resolve, reject) => {
                if (this.charactersFetched) {
                    resolve(this.characters[id]);
                } else {
                    this.fetchCharacters().then(
                        () => {
                            resolve(this.characters[id]);
                        }
                    );
                }
            }
        );
        return promise;
    }

    updateCharacterById(id: number, character: Character) {
        this.characters[id] = character;
        this.saveCharacters(this.characters).subscribe(
            () => { },
            (error) => {
                this.errorService.displayError(error.json().error);
            }
        );
    }

    updateCharacterByIdAfterEdit(id: number, character: Character) {
        // const char = this.convertClass(character);
        this.characters[id] = character;
        this.saveCharacters(this.characters).subscribe(
            () => { },
            (error) => {
                this.errorService.displayError(error.json().error);
            }
        );
    }

    addCharacter(character: Character) {
        // const char = this.convertClass(character);
        this.characters.push(character);
        this.saveCharacters(this.characters).subscribe(
            () => { },
            (error) => {
                this.errorService.displayError(error.json().error);
            }
        );
    }

    deleteCharacter(id: number) {
        this.characters.splice(id, 1);
        this.saveCharacters(this.characters).subscribe(
            () => { },
            (error) => {
                this.errorService.displayError(error.message);
            }
        );
    }

    // Inventory Methods
    addInventoryItem(charId: number, item: InventoryItem) {
        if (this.characters[charId].inventory) {
            this.characters[charId].inventory.push(item);
        } else {
            this.characters[charId].inventory = [item];
        }
        this.characters[charId].addLog('Added <' + item.name + ' x' + item.amount + '> to inventory', 'inventoryLog');
        this.updateCharacterById(charId, this.characters[charId]);
    }

    getInventory(charId: number) {
        return this.characters[charId].inventory;
    }

    updateInventoryItem(charId: number, itemId: number, item: InventoryItem) {
        const character = this.characters[charId];
        character.inventory[itemId] = item;
        this.characters[charId].addLog('Updated Item  <' + item.name + '>', 'inventoryLog');
        this.updateCharacterById(charId, character);
    }

    useInventoryItem(charId: number, itemId: number) {
        const character = this.characters[charId];
        const item = character.inventory[itemId];
        this.characters[charId].addLog('Removed 1 stack of <' + item.name + '> from inventory', 'inventoryLog');

        if (item.amount === 1) {
            character.inventory.splice(itemId, 1);
            this.updateCharacterById(charId, character);
        } else {
            character.inventory[itemId].amount--;
            this.updateCharacterById(charId, character);
        }
    }

    deleteInventoryItem(charId: number, itemId: number) {
        this.characters[charId].addLog('Removed <' + this.characters[charId].inventory[itemId].name + '> from inventory', 'inventoryLog');
        this.characters[charId].inventory.splice(itemId, 1);
        this.updateCharacterById(charId, this.characters[charId]);
    }

    addGold(charId: number, gold: number) {
        this.characters[charId].gold += gold;
        this.characters[charId].addLog('Added  <' + gold + '> gold to inventory', 'inventoryLog');
        this.updateCharacterById(charId, this.characters[charId]);
    }

    reduceGold(charId: number, gold: number) {
        this.characters[charId].gold -= gold;
        this.characters[charId].addLog('Removed  <' + gold + '> gold from inventory', 'inventoryLog');
        this.updateCharacterById(charId, this.characters[charId]);
    }

    // Npc Methods
    addNpc(charId: number, npc: Npc) {
        if (this.characters[charId].npcList) {
            this.characters[charId].npcList.push(npc);
        } else {
            this.characters[charId].npcList = [npc];
        }
        this.characters[charId].addLog('Added NPC  <' + npc.name + '>', 'npcLog');
        this.updateCharacterById(charId, this.characters[charId]);
    }

    getNpcs(charId: number) {
        return this.characters[charId].npcList;
    }

    updateNpc(charId: number, npcId: number, npc: Npc) {
        const character = this.characters[charId];
        character.npcList[npcId] = npc;
        this.characters[charId].addLog('Updated NPC  <' + npc.name + '>', 'npcLog');
        this.updateCharacterById(charId, character);
    }

    deleteNpc(charId: number, npcId: number) {
        this.characters[charId].addLog('Removed NPC  <' + this.characters[charId].npcList[npcId].name + '>', 'npcLog');
        this.characters[charId].npcList.splice(npcId, 1);
        this.updateCharacterById(charId, this.characters[charId]);
    }

    // Questlog Methods
    addQuest(charId: number, quest: Quest) {
        if (this.characters[charId].questLog) {
            this.characters[charId].questLog.push(quest);
        } else {
            this.characters[charId].questLog = [quest];
        }
        this.characters[charId].addLog('Added quest  <' + quest.name + '>', 'questLog');
        this.updateCharacterById(charId, this.characters[charId]);
    }

    getQuests(charId: number) {
        return this.characters[charId].questLog;
    }

    updateQuest(charId: number, questId: number, quest: Quest) {
        const character = this.characters[charId];
        character.questLog[questId] = quest;
        this.characters[charId].addLog('Updated quest  <' + quest.name + '>', 'questLog');
        this.updateCharacterById(charId, character);
    }

    deleteQuest(charId: number, questId: number) {
        this.characters[charId].addLog('Deleted quest  <' + this.characters[charId].questLog[questId].name + '>', 'questLog');
        this.characters[charId].questLog.splice(questId, 1);
        this.updateCharacterById(charId, this.characters[charId]);
    }

    // Ability Methods
    addAbility(charId: number, ability: Ability) {
        if (this.characters[charId].abilities) {
            this.characters[charId].abilities.push(ability);
        } else {
            this.characters[charId].abilities = [ability];
        }
        this.characters[charId].addLog('Added ability  <' + ability.name + '>', 'abilityLog');
        this.updateCharacterById(charId, this.characters[charId]);
    }

    updateAbility(charId: number, abilityId: number, ability: Ability) {
        const character = this.characters[charId];
        character.abilities[abilityId] = ability;
        this.characters[charId].addLog('Updated ability  <' + ability.name + '>', 'abilityLog');
        this.updateCharacterById(charId, character);
    }

    getAbilities(charId: number) {
        return this.characters[charId].abilities;
    }

    deleteAbility(charId: number, abilityId: number) {
        this.characters[charId].addLog('Removed ability  <' + this.characters[charId].abilities[abilityId].name + '>', 'abilityLog');
        this.characters[charId].abilities.splice(abilityId, 1);
        this.updateCharacterById(charId, this.characters[charId]);
    }

    // Combat Sheet Methods
    addCombatSheet(charId: number, sheet: CombatSheet) {
        if (this.characters[charId].combatSheets) {
            this.characters[charId].combatSheets.push(sheet);
        } else {
            this.characters[charId].combatSheets = [sheet];
        }
        this.characters[charId].addLog('Added combat sheet  <' + sheet.name + '>', 'combatSheetLog');
        this.updateCharacterById(charId, this.characters[charId]);
    }

    updateCombatSheet(charId: number, sheetIndex: number, sheet: CombatSheet) {
        const character = this.characters[charId];
        character.combatSheets[sheetIndex] = sheet;
        this.characters[charId].addLog('Updated combat sheet  <' + sheet.name + '>', 'combatSheetLog');
        this.updateCharacterById(charId, character);
    }

    getCombatSheets(charId: number) {
        return this.characters[charId].combatSheets;
    }

    deleteCombatSheet(charId: number, sheetIndex: number) {
        this.characters[charId]
            .addLog('Removed combat sheet  <' + this.characters[charId].combatSheets[sheetIndex].name + '>', 'combatSheetLog');
        this.characters[charId].combatSheets.splice(sheetIndex, 1);
        this.updateCharacterById(charId, this.characters[charId]);
    }

    // Reset the service (clear)

    clear() {
        this.characters = [];
        this.charactersFetched = false;
    }
}
