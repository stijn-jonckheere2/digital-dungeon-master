import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MinionWoundSheet } from '../../../../../shared/models';

@Component({
  selector: 'app-minion-chooser',
  templateUrl: './minion-chooser.component.html',
  styleUrls: ['./minion-chooser.component.scss']
})
export class MinionChooserComponent implements OnInit {
  @Input() minionSheets: MinionWoundSheet[];
  @Output() minionSelected: EventEmitter<number> = new EventEmitter();
  @Output() minionCanceled: EventEmitter<null> = new EventEmitter();
  @Output() minionAdded: EventEmitter<MinionWoundSheet> = new EventEmitter();
  @Output() minionRemoved: EventEmitter<number> = new EventEmitter();

  minionFormEnabled = false;
  newMinionWoundSheet: MinionWoundSheet = new MinionWoundSheet('');

  constructor() { }

  ngOnInit() {
  }

  selectMinion(minionIndex: number) {
    this.minionSelected.emit(minionIndex);
  }

  onAddMinion() {
    this.minionAdded.emit(this.newMinionWoundSheet);
    this.cancelAddMinion();
  }

  deleteMinion(minionIndex: number) {
    const minionName = this.minionSheets[minionIndex].name;

    if (confirm('Are you sure you want to send ' + minionName + ' back to the shadows?')) {
      this.minionRemoved.emit(minionIndex);
    }
  }

  cancelMinion() {
    this.minionCanceled.emit();
  }

  cancelAddMinion() {
    this.minionFormEnabled = false;
    this.newMinionWoundSheet = new MinionWoundSheet('');
  }

  summonMinion() {
    this.minionFormEnabled = true;
  }
}
