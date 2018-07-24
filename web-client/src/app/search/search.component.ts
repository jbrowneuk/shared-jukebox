import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { TrackData } from '../../../../shared/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  public searchTerm: string;
  public results: TrackData[];

  constructor(private socket: SocketService) {
    this.searchTerm = '';
    this.results = [];
  }

  public onSearchClick(): void {
    this.socket.emit('query', this.searchTerm, (data: TrackData[]) => {
      console.log(data);
      this.results = data;
    });
  }

  public onTermClicked(songId: string): void {
    const relatedInfo = this.results.find(s => s.songId === songId);
    if (!relatedInfo) {
      return;
    }

    this.socket.emit('request', relatedInfo);
  }

}
