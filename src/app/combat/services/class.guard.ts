import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, RouterLink, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { CharacterService } from "../../shared/services";
import { Character } from "../../shared/models";

@Injectable()
export class ClassGuard implements CanActivate {
  constructor(private characterService: CharacterService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const charId = +next.parent.params["id"];
    const sheetId = +next.params["sheetId"];
    const routeBase = ["characters", charId, "combat-sheets", sheetId, "default"];

    this.characterService.getCharacterById(charId).then(
      (char: Character) => {
        switch (char.className) {
          case "Draconic Blood Knight":
            routeBase[routeBase.length - 1] = "draconic-blood-knight";
            break;
          case "Necromancer":
            routeBase[routeBase.length - 1] = "necromancer";
            break;
        }
        this.router.navigate(routeBase);
      }
    );
    return true;
  }
}
