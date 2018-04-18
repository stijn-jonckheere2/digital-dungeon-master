import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Routes, RouterModule, Router } from "@angular/router";

import { ErrorService, CharacterService } from "../shared/services";
import { CombatSheetListComponent } from "./components/combat-sheet-list/combat-sheet-list.component";
import { AbilityChooserComponent } from "./components/ability-chooser/ability-chooser.component";
import { ItemChooserComponent } from "./components/item-chooser/item-chooser.component";
import { WoundSelectorComponent } from "./components/wound-selector/wound-selector.component";
import { CombatSheetComponent } from "./components/combat-sheet/combat-sheet.component";
import { WoundFormComponent } from "./components/wound-form/wound-form.component";
import { WoundPipePipe } from "./pipes";
import { AuthGuard } from "../auth/services";
import { FormsModule } from "@angular/forms";

const combatRoutes: Routes = [
  {
    path: "characters/:id", children: [
      { path: "combat-sheets", component: CombatSheetListComponent, canActivate: [AuthGuard] },
      { path: "combat-sheets/:sheetId", component: CombatSheetComponent, canActivate: [AuthGuard] },
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
    ItemChooserComponent,
    WoundSelectorComponent,
    CombatSheetComponent,
    WoundFormComponent,
    WoundPipePipe
  ],
  providers: [
    CharacterService,
    ErrorService
  ],
  exports: [
    RouterModule
  ]
})
export class CombatModule { }
