import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { CharacterListComponent } from "./character-list/character-list.component";
import { CharacterService } from "./character.service";
import { HttpModule } from "@angular/http";
import { AuthGuard } from "../auth/auth-guard.service";
import { CharacterEditComponent } from "./character-edit/character-edit.component";
import { CharacterNewComponent } from "./character-new/character-new.component";
import { CharacterMenuComponent } from "./character-menu/character-menu.component";
import { InventoryComponent } from "../character-sub/inventory/inventory.component";
import { NpcComponent } from "../character-sub/npc/npc.component";
import { QuestlogComponent } from "../character-sub/questlog/questlog.component";
import { StatsComponent } from "../character-stats/stats/stats.component";
import { EquipmentStatsComponent } from "../character-stats/equipment-stats/equipment-stats.component";
import { ProfessionStatsComponent } from "../character-stats/profession-stats/profession-stats.component";
import { ErrorService } from "../error-service.service";
import { AbilitiesComponent } from "../character-sub/abilities/abilities.component";
import { CharacterLogsComponent } from "./character-logs/character-logs.component";
import { FilterPipe } from './character-logs/filter.pipe';

const charRoutes: Routes = [
    { path: "characters", component: CharacterListComponent, canActivate: [AuthGuard] },
    { path: "characters/new", component: CharacterNewComponent, canActivate: [AuthGuard] },
    {
        path: "characters/:id", component: CharacterMenuComponent, canActivate: [AuthGuard], children: [
            { path: "stats", component: StatsComponent, canActivate: [AuthGuard] },
            { path: "abilities", component: AbilitiesComponent, canActivate: [AuthGuard] },
            { path: "equipment", component: EquipmentStatsComponent, canActivate: [AuthGuard] },
            { path: "professions", component: ProfessionStatsComponent, canActivate: [AuthGuard] },
            { path: "inventory", component: InventoryComponent, canActivate: [AuthGuard] },
            { path: "npcs", component: NpcComponent, canActivate: [AuthGuard] },
            { path: "quests", component: QuestlogComponent, canActivate: [AuthGuard] },
            { path: "logs", component: CharacterLogsComponent, canActivate: [AuthGuard] }
        ]
    },
    { path: "characters/:id/edit", component: CharacterEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
    declarations: [
        CharacterListComponent,
        CharacterEditComponent,
        CharacterNewComponent,
        CharacterMenuComponent,
        CharacterLogsComponent,
        FilterPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        RouterModule.forChild(charRoutes)
    ],
    providers: [
        CharacterService,
        ErrorService
    ],
    exports: [
        RouterModule
    ]
})
export class CharacterModule {

}
