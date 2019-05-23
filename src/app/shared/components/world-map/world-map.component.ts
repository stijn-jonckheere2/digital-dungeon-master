import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { WorldMapService } from '../../../main/services';

@Component({
    selector: 'world-map',
    templateUrl: 'world-map.component.html',
    styleUrls: ['world-map.component.scss']
})
export class WorldMapComponent implements OnInit {
    mapSource: string;
    fullscreen = false;
    mapSourceLoading = false;

    constructor(private worldMapService: WorldMapService) {
    }

    async ngOnInit(): Promise<void> {
        this.mapSourceLoading = true;
        this.fetchMapSource();
        this.mapSourceLoading = false;
    }

    async fetchMapSource(): Promise<void> {
        this.mapSource = await this.worldMapService.getSource();
    }

    toggleFullscreen(state: boolean): void {
        this.fullscreen = state;
    }


    async refreshWorldMap(): Promise<void> {
        this.mapSourceLoading = true;
        await this.fetchMapSource();
        this.mapSourceLoading = false;
    }
}
