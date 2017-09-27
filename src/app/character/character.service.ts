import { Injectable, EventEmitter } from "@angular/core";

import { AuthService } from "../auth/auth.service";
import { Http } from "@angular/http";
import { Character, InventoryItem, Npc, Quest, Ability } from "./character.models";
import { ErrorService } from "../error-service.service";

@Injectable()
export class CharacterService {

    characters: Character[] = [];
    charactersFetched = false;
    characterSelection = new EventEmitter<number>();

    constructor(private authService: AuthService,
        private http: Http,
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
        const token = this.authService.getToken();
        const url = "https://digital-dungeon-master.firebaseio.com/" + userId +
            "-characters.json?auth=" + token;
        return this.http.put(url, this.characters);
    }

    fetchCharacters() {
        const fetchPromise = new Promise(
            (resolve, reject) => {
                const userId = this.authService.getUserId();
                const token = this.authService.getToken();
                const url = "https://digital-dungeon-master.firebaseio.com/" + userId +
                    "-characters.json?auth=" + token;

                this.http.get(url).subscribe(
                    (response) => {
                        const characters = response.json();
                        if (characters !== null) {
                            console.log("got chars", characters);
                            this.convertCharacters(characters);
                        }
                        this.charactersFetched = true;
                        console.log("characters fetched", this.characters);
                        resolve();
                    },
                    (error) => {
                        this.errorService.displayError(error.json().error);
                        reject(error);
                    }
                );
            }
        );
        return fetchPromise;
    }

    convertCharacters(characters) {
        this.characters = characters.map((char, index) => {
            return Character.fromJSON(char);
        });
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

    addCharacter(character: Character) {
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
        this.updateCharacterById(charId, this.characters[charId]);
    }

    getInventory(charId: number) {
        return this.characters[charId].inventory;
    }

    useInventoryItem(charId: number, itemId: number) {
        const character = this.characters[charId];
        const item = character.inventory[itemId];

        if (item.amount === 1) {
            character.inventory.splice(itemId, 1);
            this.updateCharacterById(charId, character);
        } else {
            character.inventory[itemId].amount--;
            this.updateCharacterById(charId, character);
        }
    }

    deleteInventoryItem(charId: number, itemId: number) {
        this.characters[charId].inventory.splice(itemId, 1);
        this.updateCharacterById(charId, this.characters[charId]);
    }

    addGold(charId: number, gold: number) {
        this.characters[charId].gold += gold;
        this.updateCharacterById(charId, this.characters[charId]);
    }

    reduceGold(charId: number, gold: number) {
        this.characters[charId].gold -= gold;
        this.updateCharacterById(charId, this.characters[charId]);
    }

    // Npc Methods
    addNpc(charId: number, npc: Npc) {
        if (this.characters[charId].npcList) {
            this.characters[charId].npcList.unshift(npc);
        } else {
            this.characters[charId].npcList = [npc];
        }
        this.updateCharacterById(charId, this.characters[charId]);
    }

    getNpcs(charId: number) {
        return this.characters[charId].npcList;
    }

    updateNpc(charId: number, npcId: number, npc: Npc) {
        const character = this.characters[charId];
        character.npcList[npcId] = npc;
        this.updateCharacterById(charId, character);
    }

    deleteNpc(charId: number, npcId: number) {
        this.characters[charId].npcList.splice(npcId, 1);
        this.updateCharacterById(charId, this.characters[charId]);
    }

    // Questlog Methods
    addQuest(charId: number, quest: Quest) {
        if (this.characters[charId].questLog) {
            this.characters[charId].questLog.unshift(quest);
        } else {
            this.characters[charId].questLog = [quest];
        }        this.updateCharacterById(charId, this.characters[charId]);
    }

    getQuests(charId: number) {
        return this.characters[charId].questLog;
    }

    updateQuest(charId: number, questId: number, quest: Quest) {
        const character = this.characters[charId];
        character.questLog[questId] = quest;
        this.updateCharacterById(charId, character);
    }

    deleteQuest(charId: number, questId: number) {
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
        this.updateCharacterById(charId, this.characters[charId]);
    }

    updateAbility(charId: number, abilityId: number, ability: Ability) {
        const character = this.characters[charId];
        character.abilities[abilityId] = ability;
        this.updateCharacterById(charId, character);
    }

    getAbilities(charId: number) {
        return this.characters[charId].abilities;
    }

    deleteAbility(charId: number, abilityId: number) {
        this.characters[charId].abilities.splice(abilityId, 1);
        this.updateCharacterById(charId, this.characters[charId]);
    }

    // Reset the service (clear)

    clear() {
        this.characters = [];
        this.charactersFetched = false;
    }
}
