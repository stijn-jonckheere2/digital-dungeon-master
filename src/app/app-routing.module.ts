import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./auth/auth-guard.service";

import { CharacterNewComponent } from "./character/character-new/character-new.component";
import { CharacterEditComponent } from "./character/character-edit/character-edit.component";
import { CharacterListComponent } from "./character/character-list/character-list.component";
import { PlayerNotesComponent } from "./infrastructure/player-notes/player-notes.component";
import { StoryRecapComponent } from "./infrastructure/story-recap/story-recap.component";

const appRoutes: Routes = [
  { path: "player-notes", component: PlayerNotesComponent, canActivate: [AuthGuard] },
  { path: "story-recap", component: StoryRecapComponent, canActivate: [AuthGuard] },
  { path: "", redirectTo: "characters", pathMatch: "full" },
  // { path: "**", redirectTo: "characters" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
