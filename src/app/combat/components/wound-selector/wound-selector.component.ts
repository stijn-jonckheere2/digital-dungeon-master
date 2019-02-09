import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CombatWound, WoundLocation, WoundSeverity } from '../../../shared/models';

@Component({
  selector: 'app-wound-selector',
  templateUrl: './wound-selector.component.html',
  styleUrls: ['./wound-selector.component.scss']
})
export class WoundSelectorComponent implements OnInit {
  woundLocation = WoundLocation;
  woundSeverity = WoundSeverity;

  @Input() wounds: CombatWound[];

  @Output() addWound: EventEmitter<CombatWound> = new EventEmitter();
  @Output() removeWound: EventEmitter<CombatWound> = new EventEmitter();
  @Output() clearWounds: EventEmitter<WoundLocation> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onAddWound(wound: CombatWound): void {
    this.addWound.emit(wound);
  }

  onRemoveWound(wound: CombatWound): void {
    this.removeWound.emit(wound);
  }

  onClearWounds(location: WoundLocation): void {
    this.clearWounds.emit(location);
  }
}
