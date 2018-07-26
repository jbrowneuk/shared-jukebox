import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { TrackData } from '../../../../shared/models';

import { AnimationSettings } from './search.component.transitions';
import { WebClientEvents } from '../../../../shared/constants';

type ResultsTuple = [TrackData, boolean];

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: AnimationSettings
})
export class SearchComponent {

  public searchTerm: string;
  public results: ResultsTuple[];

  constructor(private socket: SocketService) {
    this.searchTerm = '';
    this.results = null;
  }

  public onSearchClick(): void {
    this.socket.emit(WebClientEvents.SearchQuery, this.searchTerm, (data: TrackData[]) => {
      this.results = data.map(x => [x, false || x.requestedBy !== ''] as ResultsTuple);
    });
  }

  public onTermClicked(songId: string): void {
    const relatedInfo = this.results.find(pair => pair[0].songId === songId)[0];
    if (!relatedInfo) {
      return;
    }

    this.socket.emit(WebClientEvents.SongRequest, relatedInfo, (addedId: string) => {
      if (!addedId) {
        // Need to show error in UI
        return;
      }

      const selected = this.results.findIndex((result: ResultsTuple) => result[0].songId === addedId);
      if (selected < 0) {
        return;
      }

      this.results[selected][1] = true;
    });
  }

}
