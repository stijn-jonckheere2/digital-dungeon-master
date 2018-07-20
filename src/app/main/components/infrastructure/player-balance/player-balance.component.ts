import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PlayerNotesService } from "../../../services";
import { ErrorService } from "../../../../shared/services";
import { BalanceService } from "../../../services/balance.service";

@Component({
  selector: "app-player-balance",
  templateUrl: "./player-balance.component.html",
  styleUrls: ["./player-balance.component.scss"]
})
export class PlayerBalanceComponent implements OnInit {

  playerBalance = 0;
  playerBalanceFetched = false;

  constructor(private balanceService: BalanceService,
    private router: Router,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.updateBalance();
  }

  updateBalance() {
    this.balanceService.getPlayerBalance().then(
      (balance: number) => {
        if (balance !== null && balance !== undefined) {
          this.playerBalance = balance;
        }
        this.playerBalanceFetched = true;
      }
    );
  }

  addBalance(positive: boolean, balance: number) {
    if ((positive && this.playerBalance < 100) || (!positive && this.playerBalance > -100)) {
      this.playerBalance += balance;
      this.saveBalance();
    }
  }

  getLightPercentage(): number {
    if (this.playerBalance === -100) {
      // Full dark
      return 0;
    } else if (this.playerBalance === 100) {
      // Full light
      return 100;
    } else {
      if (this.playerBalance === 0) {
        // Fully balanced
        return 50;
      } else {
        if (this.playerBalance > 0) {
          // Balance is positive
          return ((100 + this.playerBalance) / 200) * 100;
        } else {
          // Balance is negative
          return ((100 - -this.playerBalance) / 200) * 100;
        }
      }
    }
  }

  getDarkPercentage(): number {
    if (this.playerBalance === 100) {
      // Full light
      return 0;
    } else if (this.playerBalance === -100) {
      // Full dark
      return 100;
    } else {
      if (this.playerBalance === 0) {
        // Fully balanced
        return 50;
      } else {
        if (this.playerBalance > 0) {
          return ((100 - this.playerBalance) / 200) * 100;
        } else {
          // Balance is negative
          return ((100 + -this.playerBalance) / 200) * 100;
        }
      }
    }
  }

  saveBalance() {
    this.balanceService.saveBalance(this.playerBalance);
  }
}
