import { Component, Input, EventEmitter, OnInit, OnChanges } from "@angular/core";
import { Ability } from "../../../../../shared/models";

@Component({
  selector: "app-pain-meter",
  templateUrl: "./pain-meter.component.html",
  styleUrls: ["./pain-meter.component.scss"]
})
export class PainMeterComponent implements OnInit, OnChanges {
  @Input() painLevel: number;
  painBlocks: number[] = [];

  constructor() { }

  ngOnInit() {
    this.calculateBlocks();
  }

  ngOnChanges() {
    this.calculateBlocks();
  }

  calculateBlocks() {
    this.painBlocks = [];

    for (let i = 1; i <= this.painLevel; i++) {
      this.painBlocks.push(i);
    }
  }

}
