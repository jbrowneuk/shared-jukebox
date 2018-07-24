import { Component } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  public searchTerm: string;
  public results: any[];

  constructor(private socket: SocketService) {
    this.searchTerm = '';
    this.results = [];

    socket.subscribe('results', (data: any[]) => {
      console.log(data);
      this.results = data;
    });
  }

  public onSearchClick(): void {
    this.socket.emit('query', this.searchTerm);
  }

  public onTermClicked(songId: string): void {
    const relatedInfo = this.results.find(s => s.spotifyId === songId);
    if (!relatedInfo) {
      return;
    }

    this.socket.emit('request', relatedInfo);
  }

}
