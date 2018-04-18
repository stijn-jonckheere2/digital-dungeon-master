import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class ErrorService {
  errorDismissed = new EventEmitter<any>();
  errorEvent = new EventEmitter<string>();

  constructor() { }

  displayError(message: string) {
    this.errorEvent.emit(message);

    setTimeout(() => {
      this.dismissError();
    }, 5000);
  }

  dismissError() {
    this.errorDismissed.emit();
  }
}
