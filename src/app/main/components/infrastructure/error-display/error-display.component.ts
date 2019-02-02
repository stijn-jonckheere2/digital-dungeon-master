import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../../../shared/services';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss']
})
export class ErrorDisplayComponent implements OnInit {

  errorListener: any;
  error: string;

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.errorService.errorEvent.subscribe(
      (error: string) => this.error = error
    );

    this.errorService.errorDismissed.subscribe(
      () => this.error = ''
    );
  }

  removeError() {
    this.errorService.dismissError();
  }

}
