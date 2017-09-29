import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { ErrorService } from "../../error-service.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {

  errorMessage: string;

  constructor(private authService: AuthService,
    private errorService: ErrorService) { }

  ngOnInit() {
  }

  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    const repeatPassword = form.value.repeatPassword;

    if ((password !== repeatPassword)) {
      this.errorService.displayError("You're password and repeat-password don't match!");
    } else {
      this.authService.signupUser(email, password);
    }

  }

}
