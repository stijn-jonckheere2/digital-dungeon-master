import { Component } from '@angular/core';

@Component({
    selector: 'world-map',
    templateUrl: 'world-map.component.html',
    styleUrls: ['world-map.component.scss']
})
export class WorldMapComponent {
    fullscreen = false;

    toggleFullscreen(state: boolean): void {
        this.fullscreen = state;
    }
}
