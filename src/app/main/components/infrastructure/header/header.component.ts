import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/services';
import { CharacterService } from '../../../../shared/services';
import { MatSidenav } from '@angular/material';

// tslint:disable:align

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authenticated = false;
  selectedChar: number;

  authListener: any;
  charListener: any;

  @ViewChild('sidenav') sidenav: MatSidenav;

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

  onOpenSidebar(): void {
    if (this.authenticated) {
      this.sidenav.open();
    }
  }

  onCloseSidebar(): void {
    this.sidenav.close();
  }

  unselectCharacter() {
    this.characterService.unsetCharacterSelected();
    this.router.navigate(['/characters']);
  }

  onLogout() {
    this.characterService.unsetCharacterSelected();
    this.characterService.clear();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListener.unsubscribe();
  }

}
