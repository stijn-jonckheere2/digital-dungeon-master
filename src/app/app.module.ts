import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { AuthService } from "./auth/auth.service";
import { ErrorService } from "./error-service.service";

import { AuthGuard } from "./auth/auth-guard.service";
import { AuthModule } from "./auth/auth.module";

import { HeaderComponent } from "./infrastructure/header/header.component";
import { CharacterModule } from "./character/character.module";
import { InventoryComponent } from "./character-sub/inventory/inventory.component";
import { NpcComponent } from "./character-sub/npc/npc.component";
import { QuestlogComponent } from "./character-sub/questlog/questlog.component";
import { StatsComponent } from "./character-stats/stats/stats.component";
import { EquipmentStatsComponent } from "./character-stats/equipment-stats/equipment-stats.component";
import { ProfessionStatsComponent } from "./character-stats/profession-stats/profession-stats.component";
import { ErrorDisplayComponent } from "./infrastructure/error-display/error-display.component";
import { AbilitiesComponent } from "./character-sub/abilities/abilities.component";
import { PlayerNotesComponent } from "./infrastructure/player-notes/player-notes.component";
import { PlayerNotesService } from "./player-notes.service";
import { StoryRecapComponent } from "./infrastructure/story-recap/story-recap.component";
import { StoryRecapService } from "./story-recap.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InventoryComponent,
    NpcComponent,
    QuestlogComponent,
    StatsComponent,
    EquipmentStatsComponent,
    ProfessionStatsComponent,
    ErrorDisplayComponent,
    AbilitiesComponent,
    PlayerNotesComponent,
    StoryRecapComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AuthModule,
    FormsModule,
    CharacterModule,
    AppRoutingModule,
  ],
  providers: [AuthService, ErrorService, PlayerNotesService, StoryRecapService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
