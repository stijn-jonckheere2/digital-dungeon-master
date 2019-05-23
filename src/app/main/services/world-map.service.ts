import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

// tslint:disable:align

@Injectable()
export class WorldMapService {
  constructor(private http: HttpClient) { }

  async getSource(): Promise<string> {
    const url = environment.database.databaseURL + '/worldmapsource.json';
    const response: any = await this.http.get(url).toPromise();
    const source = response !== null ? response[0] : null;
    return source !== null ? source : 'assets/images/world-map-small.jpg';
  }
}
