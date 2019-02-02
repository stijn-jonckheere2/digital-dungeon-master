import { v1 as uuidv1 } from 'uuid';
import { ChaosMageAbilityType } from './character.enums';

// tslint:disable:prefer-for-of
// tslint:disable:space-before-function-paren

class Serializable {
  static fromJSON(jsonObj: Character) {
    const convertedChar = new Character(
      jsonObj.name,
      jsonObj.race,
      jsonObj.className,
      jsonObj.age,
      jsonObj.description,
      jsonObj.level
    );

    convertedChar.gold = jsonObj.gold;

    convertedChar.abilities = jsonObj.abilities || [];
    convertedChar.inventory = jsonObj.inventory || [];
    convertedChar.questLog = jsonObj.questLog || [];
    convertedChar.npcList = jsonObj.npcList || [];
    convertedChar.combatSheets = jsonObj.combatSheets
      ? this.combatSheetsFromJSON(jsonObj.combatSheets)
      : [];

    convertedChar.primaryStats = jsonObj.primaryStats;
    convertedChar.secondaryStats = jsonObj.secondaryStats;

    convertedChar.weaponStats = jsonObj.weaponStats;
    convertedChar.armorStats = jsonObj.armorStats;
    convertedChar.rangedStats = jsonObj.rangedStats;
    convertedChar.professionStats = jsonObj.professionStats;

    convertedChar.logs = jsonObj.logs || [];

    // add inventory item types
    for (let i = 0; i < convertedChar.inventory.length; i++) {
      if (!convertedChar.inventory[i].type) {
        convertedChar.inventory[i].type = 'unknown';
      }
    }

    // add ability amountOfStrikes
    for (let i = 0; i < convertedChar.abilities.length; i++) {
      if (!convertedChar.abilities[i].amountOfStrikes) {
        convertedChar.abilities[i].amountOfStrikes = 1;
      }
      if (!convertedChar.abilities[i].hasStatusEffect) {
        convertedChar.abilities[i].hasStatusEffect = false;
        convertedChar.abilities[i].effect = {
          name: '',
          numberOfTurns: 1
        };
      }
    }

    return convertedChar;
  }
  static combatSheetsFromJSON(jsonObj: CombatSheet[]) {
    const sheets: CombatSheet[] = [];

    jsonObj.map(sheet => {
      if (!sheet.actions) {
        sheet.actions = [];
      }
      if (!sheet.wounds) {
        sheet.wounds = [];
      }
      if (!sheet.statusEffects) {
        sheet.statusEffects = [];
      }
      if (!sheet.minionWoundSheets) {
        sheet.minionWoundSheets = [];
      }

      sheet.minionWoundSheets.map(minionSheet => {
        minionSheet.wounds = minionSheet.wounds ? minionSheet.wounds : [];
      });

      sheets.push(sheet);
    });

    return sheets;
  }
}

export class Character extends Serializable {
  public gold: number;

  public abilities: Ability[];
  public inventory: InventoryItem[];
  public questLog: Quest[];
  public npcList: Npc[];
  public combatSheets: CombatSheet[];

  public primaryStats: CharacterStat[];
  public armorStats: CharacterStat[];
  public weaponStats: CharacterSecondaryStat[];
  public rangedStats: CharacterSecondaryStat[];
  public professionStats: CharacterSecondaryStat[];
  public secondaryStats: CharacterSecondaryStat[];

  public logs: CharacterLog[];

  constructor(
    public name: string,
    public race: string,
    public className: string,
    public age: number,
    public description: string,
    public level: number
  ) {
    super();

    this.abilities = [];
    this.inventory = [];
    this.questLog = [];
    this.npcList = [];
    this.combatSheets = [];

    this.gold = 0;

    this.generatePrimaryStats();
    this.generateSecondaryStats();
    this.generateWeaponStats();
    this.generateRangedStats();
    this.generateArmorStats();
    this.generateProfessionStats();

    this.logs = [];
  }

  generatePrimaryStats() {
    this.primaryStats = [];
    for (const stat of primaryStatNames) {
      this.primaryStats.push(new CharacterStat(stat, 0));
    }
  }

  generateArmorStats() {
    this.armorStats = [];
    for (const stat of armorStatNames) {
      this.armorStats.push(new CharacterStat(stat, 3));
    }
  }

  generateWeaponStats() {
    this.weaponStats = [];
    for (const stat of weaponStatNames) {
      this.weaponStats.push(new CharacterSecondaryStat(stat[0], 3, stat[1]));
    }
  }

  generateRangedStats() {
    this.rangedStats = [];
    for (const stat of rangedStatNames) {
      this.rangedStats.push(new CharacterSecondaryStat(stat[0], 3, stat[1]));
    }
  }

  generateProfessionStats() {
    this.professionStats = [];
    for (const stat of professionStatNames) {
      this.professionStats.push(
        new CharacterSecondaryStat(stat[0], 3, stat[1])
      );
    }
  }

  generateSecondaryStats() {
    this.secondaryStats = [];
    for (const stat of secondaryStatNames) {
      this.secondaryStats.push(new CharacterSecondaryStat(stat[0], 3, stat[1]));
    }
  }

  public addLog = function (logText: string, logType: string) {
    this.logs.unshift(new CharacterLog(logText, logType));
  };

  public clearLogs = function () {
    this.logs = [];
  };

  public getQuests = function () {
    const quests: Quest[] = [];

    for (const quest in this.questLog) {
      if (!this.questLog[quest].complete) {
        this.questLog[quest].originId = quest;
        quests.push(this.questLog[quest]);
      }
    }

    if (quests.length > 0) {
      return quests.sort((a, b) => {
        return a.dateAdded < b.dateAdded ? 1 : 0;
      });
    } else {
      return quests;
    }
  };

  public getCompletedQuests = function () {
    const completedQuests: Quest[] = [];

    for (const quest in this.questLog) {
      if (this.questLog[quest].complete) {
        this.questLog[quest].originId = quest;
        completedQuests.push(this.questLog[quest]);
      }
    }

    if (completedQuests.length > 0) {
      return completedQuests.sort((a, b) => {
        return a.dateAdded < b.dateAdded ? 1 : 0;
      });
    } else {
      return completedQuests;
    }
  };
}

export class Ability {
  public id: string;

  constructor(
    public name: string,
    public description: string,
    public usesPerTurn: number,
    public amountOfStrikes: number,
    public isFlavourAbility: boolean,
    public hasStatusEffect: boolean,
    public effect: {
      name: string;
      numberOfTurns: number;
    }
  ) {
    this.id = uuidv1();
  }
}

export class DraconicBloodKnightAbility extends Ability {
  constructor(
    public name: string,
    public description: string,
    public usesPerTurn: number,
    public bloodmarksPerUse: number,
    public amountOfStrikes: number,
    public isFlavourAbility: boolean,
    public hasStatusEffect: boolean,
    public effect: {
      name: string;
      numberOfTurns: number;
    }
  ) {
    super(
      name,
      description,
      usesPerTurn,
      amountOfStrikes,
      isFlavourAbility,
      hasStatusEffect,
      effect
    );
  }
}

export class ChaosMageAbility extends Ability {
  constructor(
    public name: string,
    public description: string,
    public usesPerTurn: number,
    public amountOfStrikes: number,
    public isFlavourAbility: boolean,
    public hasStatusEffect: boolean,
    public effect: {
      name: string;
      numberOfTurns: number;
    },
    public type: ChaosMageAbilityType,
    public amountOfPain: number
  ) {
    super(
      name,
      description,
      usesPerTurn,
      amountOfStrikes,
      isFlavourAbility,
      hasStatusEffect,
      effect
    );
  }
}

export class InventoryItem {
  public id: string;
  constructor(
    public name: string,
    public description: string,
    public amount: number,
    public consumable: boolean,
    public type: string
  ) {
    this.id = uuidv1();
  }
}

export class Quest {
  public id: string;
  public dateAdded: Date;
  public dateCompleted: Date;

  constructor(
    public name: string,
    public description: string,
    public complete: boolean
  ) {
    this.id = uuidv1();
    this.dateAdded = new Date();
  }

  completeQuest() {
    this.dateCompleted = new Date();
  }
}

export class Npc {
  public id: string;
  constructor(public name: string, public description: string) {
    this.id = uuidv1();
  }
}

export class CharacterStat {
  public id: string;
  constructor(public name: string, public level: number) {
    this.id = uuidv1();
  }
}

export class CharacterSecondaryStat {
  public id: string;
  constructor(
    public name: string,
    public level: number,
    public substats: string
  ) {
    this.id = uuidv1();
  }
}

export class CharacterLog {
  public id: string;
  timestamp: Date;

  constructor(public log: string, public type: string) {
    this.id = uuidv1();
    this.timestamp = new Date();
  }
}

export class StoryRecap {
  public id: string;
  public createdOn: Date;
  public modifiedOn: Date;

  constructor(
    public recap: string,
    public createdBy: string,
    public modifiedBy: string
  ) {
    this.id = uuidv1();
    this.createdOn = new Date();
    this.modifiedOn = new Date();
  }
}

export class CombatSheet extends Serializable {
  public id: string;
  public createdOn: Date;
  public modifiedOn: Date;
  public actions: any[];
  public wounds: CombatWound[];
  public statusEffects: {
    name: string;
    numberOfTurns: number;
  }[];
  public minionWoundSheets: MinionWoundSheet[];

  constructor(
    public name: string,
    public autoRoll: boolean,
    public initiative?: number
  ) {
    super();
    this.id = uuidv1();
    this.createdOn = new Date();
    this.modifiedOn = new Date();
    this.actions = [];
    this.wounds = [];
    this.statusEffects = [];
    this.minionWoundSheets = [];
  }
}

export class MinionWoundSheet {
  public wounds: CombatWound[];
  constructor(public name: string) {
    this.wounds = [];
  }
}

export class CombatWound {
  constructor(public location: string, public severity: string) { }
}

export const primaryStatNames = [
  'strength',
  'agility',
  'intellect',
  'perception',
  'charisma',
  'ego',
  'constitution',
  'education'
];

export const armorStatNames = [
  'cloth',
  'hide',
  'leather',
  'chainmail',
  'heavy plate'
];

export const weaponStatNames = [
  ['Sword', 'STR, AGI, INT'],
  ['Axe', 'STR, AGI'],
  ['Mace', 'STR, AGI, INT'],
  ['2H sword', 'STR, AGI'],
  ['2H axe', 'STR'],
  ['2H mace', 'STR'],
  ['Polearm', 'STR, AGI'],
  ['Dagger', 'STR, AGI, INT'],
  ['Offhand shield', 'STR, INT']
];

export const rangedStatNames = [
  ['Shortbow (110 m)', 'STR, AGI'],
  ['Longbow (200 m)', 'STR, AGI'],
  ['Crossbow (100 m)', 'STR, AGI'],
  ['Slingshot (80 m)', 'STR, AGI'],
  ['Throwing knife (15 m)', 'STR, AGI'],
  ['Staff', 'STR, AGI, INT'],
  ['Wand', 'INT'],
  ['Offhand orb', 'INT'],
  ['Offhand tome', 'INT']
];

export const professionStatNames = [
  ['Alchemy', 'INT'],
  ['BS armor', 'STR'],
  ['BS weapons', 'STR'],
  ['Fletching', 'STR, AGI'],
  ['Tailoring', 'STR, AGI, INT'],
  ['Leatherworking', 'STR, AGI, INT'],
  ['Runescribe', 'STR, INT'],
  ['Farming', 'STR, AGI, INT'],
  ['Hunting', 'STR, AGI'],
  ['Trap Making', 'STR, AGI']
].sort();

export const secondaryStatNames = [
  ['Sneaking', 'AGI'],
  ['Search', 'PER'],
  ['Speech', 'CHA'],
  ['Climb', 'AGI'],
  ['Dodge', 'AGI'],
  ['Hide', 'AGI'],
  ['Throwing', 'STR'],
  ['Unarmed combat', 'STR'],
  ['Fortune Telling', 'CHA'],
  ['Bargaining', 'CHA'],
  ['Language', 'EDU'],
  ['Disguise', 'AGI'],
  ['Meditation', 'INT'],
  ['Sleight of hand', 'AGI'],
  ['Savenging', 'PER'],
  ['Riding', 'AGI'],
  ['Survival', 'CON'],
  ['Burglary', 'PER'],
  ['Lockpicking', 'AGI'],
  ['Flirting', 'CHA'],
  ['Occultism', 'INT'],
  ['Cosmology', 'EDU'],
  ['Net of Contacts', 'CHA'],
  ['Information retrieval', 'CHA'],
  ['Shadowing', 'PER'],
  ['City/area knowledge', 'EGO'],
  ['Medicine', 'EDU']
].sort();
