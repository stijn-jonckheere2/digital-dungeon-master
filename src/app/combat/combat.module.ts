import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule, } from '@angular/router';

import { ErrorService, CharacterService } from '../shared/services';
import { CombatSheetListComponent } from './components/combat-sheet-list/combat-sheet-list.component';
import { ItemChooserComponent } from './components/item-chooser/item-chooser.component';
import { WoundSelectorComponent } from './components/wound-selector/wound-selector.component';
import { WoundFormComponent } from './components/wound-form/wound-form.component';
import { WoundPipePipe } from './pipes';
import { AuthGuard } from '../auth/services';
import { FormsModule } from '@angular/forms';
import { ClassGuard } from './services';

import { CombatSheetComponent } from './components/classes/default/combat-sheet/combat-sheet.component';
import { AbilityChooserComponent } from './components/classes/default/ability-chooser/ability-chooser.component';

import { CharacterMenuComponent } from '../main/components/character/character-menu/character-menu.component';
import { MinionWoundSheetComponent } from './components/classes/default/minion-wound-sheet/minion-wound-sheet.component';
import { MinionChooserComponent } from './components/classes/default/minion-chooser/minion-chooser.component';
import { MatFormFieldModule, MatInputModule, MatRippleModule, MatCheckboxModule, MatSelectModule } from '@angular/material';

const combatRoutes: Routes = [
  {
    path: 'characters/:id', component: CharacterMenuComponent, canActivate: [AuthGuard], children: [
      { path: 'combat-sheets', component: CombatSheetListComponent, canActivate: [AuthGuard] },
      { path: 'combat-sheets/:sheetId', component: CombatSheetComponent, canActivate: [AuthGuard] },
      { path: 'combat-sheets/:sheetId/minion/:minionSheetId', component: MinionWoundSheetComponent, canActivate: [AuthGuard] },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatCheckboxModule,
    MatSelectModule,
    RouterModule.forChild(combatRoutes)
  ],
  declarations: [
    CombatSheetListComponent,
    AbilityChooserComponent,
    ItemChooserComponent,
    WoundSelectorComponent,
    CombatSheetComponent,
    MinionChooserComponent,
    MinionWoundSheetComponent,
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
