import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Output() public closeResults: EventEmitter<void>;
  public results: ResultsTuple[];

  private cachedTerm: string;
  private debounceTimeout: any;
  private blockSearch: boolean;
  private isSearching: boolean;

  constructor(private socket: SocketService) {
    this.closeResults = new EventEmitter<void>();
    this.results = null;
    this.cachedTerm = '';
    this.blockSearch = false;
    this.isSearching = false;
  }

  @Input() public set searchTerm(value: string) {
    this.cachedTerm = value;

    if (!value || value.length < 1) {
      this.results = [];
      return;
    }

    this.isSearching = true;
    this.resetDebounce();
    this.debounceTimeout = setTimeout(() => this.performSearchRequest(), 500);
  }

  public get searchTerm(): string {
    return this.cachedTerm;
  }

  public get searching(): boolean {
    return this.isSearching || !!this.debounceTimeout;
  }

  public onTermClicked(songId: string): void {
    const relatedInfoPair = this.results.find(pair => pair[0].songId === songId);
    if (!relatedInfoPair) {
      return;
    }

    const relatedInfo = relatedInfoPair[0];
    this.socket.emit(WebClientEvents.SongRequest, relatedInfo, (addedTrack: TrackData) => {
      if (!addedTrack) {
        // Need to show error in UI
        return;
      }

      const selected = this.results.findIndex((result: ResultsTuple) => result[0].songId === addedTrack.songId);
      if (selected < 0) {
        return;
      }

      this.results[selected][1] = true;
    });
  }

  public onCloseClicked(): void {
    this.closeResults.emit();
  }

  private resetDebounce(): void {
    if (!this.debounceTimeout) {
      return;
    }

    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = undefined;
  }

  private performSearchRequest(): void {
    this.resetDebounce();

    if (this.blockSearch) {
      console.log('Too fast!');
      this.debounceTimeout = setTimeout(() => this.performSearchRequest(), 200);
      return;
    }

    this.blockSearch = true;

    console.log('Searching for', this.cachedTerm);
    this.socket.emit(WebClientEvents.SearchQuery, this.cachedTerm, (data: TrackData[]) => {
      this.results = data.map(x => [x, false] as ResultsTuple);
      this.blockSearch = false;
      this.isSearching = false;
    });
  }

}
