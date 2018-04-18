import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RedirectComponent } from "./components/redirect/redirect.component";

const authRoutes: Routes = [
  { path: "redirecting", component: RedirectComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
