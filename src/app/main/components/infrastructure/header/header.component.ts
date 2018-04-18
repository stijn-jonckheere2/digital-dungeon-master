import { Component, OnInit, OnDestroy } from "@angular/core";

import { Router } from "@angular/router";
import { AuthService } from "../../../../auth/services";
import { CharacterService } from "../../../../shared/services";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;

  authenticated = false;
  selectedChar = -1;

  authListener: any;
  charListener: any;

  constructor(private authService: AuthService,
    private characterService: CharacterService,
    private router: Router) {
  }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();

    this.authListener = this.authService.authEvent.subscribe(
      (state: boolean) => {
        this.authenticated = state;
      }
    );

    this.charListener = this.characterService.characterSelection.subscribe(
      (charId: number) => {
        this.selectedChar = charId;
      }
    );
  }

  unselectCharacter() {
    this.mobileMenuOpen = false;
    this.characterService.unsetCharacterSelected();
    this.router.navigate(["/characters"]);
  }

  toggleMobileMenu() {
    if (window.innerWidth <= 768) {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    } else {
      this.mobileMenuOpen = false;
    }
  }

  onLogout() {
    this.mobileMenuOpen = false;
    this.characterService.unsetCharacterSelected();
    this.characterService.clear();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListener.unsubscribe();
  }

}
