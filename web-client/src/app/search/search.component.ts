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

  constructor(private socket: SocketService) {
    this.closeResults = new EventEmitter<void>();
    this.results = null;
    this.cachedTerm = '';
  }

  @Input() public set searchTerm(value: string) {
    this.cachedTerm = value;

    if (!value || value.length < 1) {
      this.results = [];
      return;
    }

    this.resetDebounce();
    this.debounceTimeout = setTimeout(() => this.performSearchRequest(), 200);
  }

  public get searchTerm(): string {
    return this.cachedTerm;
  }

  public get isDebouncing(): boolean {
    return !!this.debounceTimeout;
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
    this.socket.emit(WebClientEvents.SearchQuery, this.cachedTerm, (data: TrackData[]) => {
      this.results = data.map(x => [x, false || x.requestedBy !== ''] as ResultsTuple);
      this.resetDebounce();
    });
  }

}
