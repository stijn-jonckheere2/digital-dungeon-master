import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PlayerNotesComponent } from "./main/components/infrastructure/player-notes/player-notes.component";
import { StoryRecapComponent } from "./main/components/infrastructure/story-recap/story-recap.component";
import { AuthGuard } from "./auth/services/auth-guard.service";

const appRoutes: Routes = [
  { path: "player-notes", component: PlayerNotesComponent, canActivate: [AuthGuard] },
  { path: "story-recap", component: StoryRecapComponent, canActivate: [AuthGuard] },
  { path: "", redirectTo: "characters", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
