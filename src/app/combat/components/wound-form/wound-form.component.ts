import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { CombatWound } from '../../../shared/models';

@Component({
  selector: 'app-wound-form',
  templateUrl: './wound-form.component.html',
  styleUrls: ['./wound-form.component.scss']
})
export class WoundFormComponent implements OnInit, OnChanges {
  @Input() wounds: CombatWound[];
  @Input() formType: string;

  @Output() woundAdded: EventEmitter<CombatWound> = new EventEmitter();
  @Output() woundLowered: EventEmitter<CombatWound> = new EventEmitter();
  @Output() woundRemoved: EventEmitter<CombatWound> = new EventEmitter();

  @Output() formCanceled: EventEmitter<null> = new EventEmitter();

  newWound = new CombatWound('head', 'SCR');

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.wounds.sort((a, b) => {
      return a.location > b.location ? 1 : 0;
    });
  }

  addWound() {
    if (confirm('Are you sure you want to add this wound?')) {
      this.woundAdded.emit(this.newWound);
    }
  }

  lowerWound(wound: CombatWound) {
    if (confirm('Are you sure you want to lower this wound?')) {
      this.woundLowered.emit(wound);
    }
  }

  removeWound(wound: CombatWound) {
    if (confirm('Are you sure you want to remove this wound?')) {
      this.woundRemoved.emit(wound);
    }
  }

  cancelForm() {
    this.formCanceled.emit();
  }

}
