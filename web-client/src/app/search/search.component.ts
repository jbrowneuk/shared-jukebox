import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { TrackData } from '../../../../shared/models';

type ResultsTuple = [TrackData, boolean];

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  public searchTerm: string;
  public results: ResultsTuple[];

  constructor(private socket: SocketService) {
    this.searchTerm = '';
    this.results = null;
  }

  public onSearchClick(): void {
    this.socket.emit('query', this.searchTerm, (data: TrackData[]) => {
      this.results = data.map(x => [x, false] as ResultsTuple);
    });
  }

  public onTermClicked(songId: string): void {
    const relatedInfo = this.results.find(pair => pair[0].songId === songId)[0];
    if (!relatedInfo) {
      return;
    }

    this.socket.emit('request', relatedInfo, (addedId: string) => {
      console.log('added ', addedId);

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
