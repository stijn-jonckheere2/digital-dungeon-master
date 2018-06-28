import { NgModule, Class } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Routes, RouterModule, Router } from "@angular/router";

import { ErrorService, CharacterService } from "../shared/services";
import { CombatSheetListComponent } from "./components/combat-sheet-list/combat-sheet-list.component";
import { ItemChooserComponent } from "./components/item-chooser/item-chooser.component";
import { WoundSelectorComponent } from "./components/wound-selector/wound-selector.component";
import { WoundFormComponent } from "./components/wound-form/wound-form.component";
import { WoundPipePipe } from "./pipes";
import { AuthGuard } from "../auth/services";
import { FormsModule } from "@angular/forms";
import { ClassGuard } from "./services";

import { CombatSheetComponent } from "./components/classes/default/combat-sheet/combat-sheet.component";
import { AbilityChooserComponent } from "./components/classes/default/ability-chooser/ability-chooser.component";

import { AbilityChooserDraconicBloodKnightComponent } from "./components/classes/draconicBloodKnight/ability-chooser/ability-chooser-draconic-blood-knight.component";
import { CombatSheetDraconicBloodKnightComponent } from "./components/classes/draconicBloodKnight/combat-sheet/combat-sheet-draconic-blood-knight.component";
import { CharacterMenuComponent } from "../main/components/character/character-menu/character-menu.component";
import { NecromancerCombatSheetComponent } from "./components/classes/necromancer/combat-sheet/combat-sheet-necromancer.component";

const combatRoutes: Routes = [
  {
    path: "characters/:id", component: CharacterMenuComponent, canActivate: [AuthGuard], children: [
      { path: "combat-sheets", component: CombatSheetListComponent, canActivate: [AuthGuard] },
      { path: "combat-sheets/:sheetId/default", component: CombatSheetComponent, canActivate: [AuthGuard] },
      { path: "combat-sheets/:sheetId/draconic-blood-knight", component: CombatSheetDraconicBloodKnightComponent, canActivate: [AuthGuard] },
      { path: "combat-sheets/:sheetId/necromancer", component: NecromancerCombatSheetComponent, canActivate: [AuthGuard] },
      { path: "combat-sheets/:sheetId", component: CombatSheetComponent, canActivate: [AuthGuard, ClassGuard] },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(combatRoutes)
  ],
  declarations: [
    CombatSheetListComponent,
    AbilityChooserComponent,
    AbilityChooserDraconicBloodKnightComponent,
    ItemChooserComponent,
    WoundSelectorComponent,
    CombatSheetComponent,
    CombatSheetDraconicBloodKnightComponent,
    NecromancerCombatSheetComponent,
    WoundFormComponent,
    WoundPipePipe
  ],
  providers: [
    CharacterService,
    ClassGuard,
    ErrorService
  ],
  exports: [
    RouterModule
  ]
})
export class CombatModule { }
