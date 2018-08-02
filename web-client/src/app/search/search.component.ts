import { Component, Input } from '@angular/core';

import { SocketService } from '../socket.service';
import { TrackData, WebClientEvents } from 'jukebox-common';
import { AnimationSettings } from './search.component.transitions';

type ResultsTuple = [TrackData, boolean];

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: AnimationSettings
})
export class SearchComponent {

  public results: ResultsTuple[];

  constructor(private socket: SocketService) {
    this.results = null;
  }

  @Input() public set searchTerm(value: string) {

    if (!value || value.length < 2) {
      this.results = [];
      return;
    }

    this.socket.emit(WebClientEvents.SearchQuery, value, (data: TrackData[]) => {
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
