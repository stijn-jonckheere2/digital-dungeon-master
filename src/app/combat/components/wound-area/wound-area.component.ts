
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WoundLocation, CombatWound, WoundSeverity } from '../../../shared/models';
import { TimeInterval } from 'rxjs';

@Component({
    selector: 'wound-area',
    templateUrl: './wound-area.component.html',
    styleUrls: [
        './wound-area.component.scss'
    ]
})
export class WoundAreaComponent implements OnInit {
    woundLocation = WoundLocation;
    woundSeverity = WoundSeverity;

    currentWoundIndex: number;
    clearTimerActive: boolean;
    removeAnimation: any;
    removeTimer: any;
    removeAnimationProgress: number;
    removeAnimationLength: number;
    removeAnimationTicks: number;
    removeAnimationTimePassed: number;

    @Input() location: WoundLocation;
    @Input() wounds: CombatWound[];

    @Output() addWound: EventEmitter<CombatWound> = new EventEmitter();
    @Output() removeWound: EventEmitter<CombatWound> = new EventEmitter();
    @Output() clearWounds: EventEmitter<WoundLocation> = new EventEmitter();

    constructor() { }

    ngOnInit() {
        this.currentWoundIndex = -1;
        this.removeAnimationProgress = 0;
        this.removeAnimationTimePassed = 0;
        this.clearTimerActive = false;

        // Set the remove animation timer settings here:
        this.removeAnimationLength = 1500;
        this.removeAnimationTicks = 100;
    }

    onAddWound(location: WoundLocation, severity: WoundSeverity): void {
        this.addWound.emit(new CombatWound(location, severity));
    }

    onClearWounds(): void {
        this.clearWounds.emit(this.location);
    }

    onRemoveWound(): void {
        if (this.currentWoundIndex !== null && this.currentWoundIndex >= 0) {
            const wound = this.wounds[this.currentWoundIndex];
            this.removeWound.emit(wound);
        }
    }

    onClearDown(event: any): void {
        this.blockEvent(event);
        this.startClearTimer();
    }

    onClearUp(event: any): void {
        this.blockEvent(event);
        this.stopClearTimer();
    }

    onWoundDown(event: any, woundIndex: number): void {
        this.blockEvent(event);
        this.currentWoundIndex = woundIndex;
        this.startRemoveTimer();
    }

    onWoundUp(event: any) {
        this.blockEvent(event);
        this.stopRemoveTimer();
        this.currentWoundIndex = null;
    }

    startClearTimer(): void {
        this.clearTimerActive = true;
        this.startRemoveAnimation();

        this.removeTimer = setTimeout(() => {
            this.onClearWounds();
            this.stopRemoveAnimation();
        }, this.removeAnimationLength);
    }

    stopClearTimer(): void {
        this.clearTimerActive = false;
        this.stopRemoveAnimation();

        if (this.removeTimer) {
            clearTimeout(this.removeTimer);
        }
    }

    startRemoveTimer(): void {
        this.startRemoveAnimation();

        this.removeTimer = setTimeout(() => {
            this.onRemoveWound();
            this.stopRemoveAnimation();
        }, this.removeAnimationLength);
    }

    stopRemoveTimer(): void {
        this.stopRemoveAnimation();

        if (this.removeTimer) {
            clearTimeout(this.removeTimer);
        }
    }

    startRemoveAnimation(): void {
        const intervalTime = this.removeAnimationLength / this.removeAnimationTicks;

        this.removeAnimation = setInterval(() => {
            this.removeAnimationTimePassed += intervalTime;
            this.calculateAnimationProgress();
        }, intervalTime);
    }

    stopRemoveAnimation(): void {
        this.removeAnimationTimePassed = 0;
        this.removeAnimationProgress = 0;
        if (this.removeAnimation) {
            clearInterval(this.removeAnimation);
        }
    }

    calculateAnimationProgress(): void {
        this.removeAnimationProgress = (this.removeAnimationTimePassed / this.removeAnimationLength) * 100;
    }

    blockEvent(event: any): void {
        event.preventDefault();
        event.stopPropagation();
    }
}
