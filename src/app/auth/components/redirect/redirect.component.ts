import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services";

@Component({
  selector: "app-redirect",
  templateUrl: "./redirect.component.html",
  styleUrls: ["./redirect.component.scss"]
})
export class RedirectComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/characters"], { replaceUrl: true });
    }
  }

}
