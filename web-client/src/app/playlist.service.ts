import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { PlayState } from 'jukebox-common';

import { TrackData, ServerEvents, WebClientEvents } from 'jukebox-common';
import { SocketService } from './socket.service';
import { BrowserTitleService } from './browser-title.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private tracklist: TrackData[];
  private playstateSubject: BehaviorSubject<PlayState>;

  constructor(private socket: SocketService, private titleService: BrowserTitleService) {
    this.tracklist = [];
    this.playstateSubject = new BehaviorSubject<PlayState>(PlayState.Stopped);

    this.subscribeToSocket();
  }

  public get tracks(): TrackData[] {
    return this.tracklist;
  }

  public get playState$(): Observable<PlayState> {
    return this.playstateSubject.asObservable();
  }

  public togglePlayState(): void {
    this.socket.emit(WebClientEvents.ChangePlaystate, 'toggle');
  }

  public skipTrack(): void {
    this.socket.emit(WebClientEvents.SongSkip, WebClientEvents.SongSkip);
  }

  private subscribeToSocket(): void {
    this.socket.subscribe(ServerEvents.QueuedTrack, (data: TrackData) => {
      this.tracklist.push(data);
    });

    this.socket.subscribe(ServerEvents.DequeuedTrack, (songId: string) => {
      const relatedTrackInfo = this.tracklist.findIndex(
        s => s.songId === songId
      );
      if (relatedTrackInfo < 0) {
        return;
      }

      this.tracklist.splice(relatedTrackInfo, 1);
    });

    this.socket.subscribe(ServerEvents.PlaystateChanged, (state: string) =>
      this.updatePlaystate(state)
    );

    this.socket.connection$.subscribe(
      (value: boolean) => this.handleSocketConnectionChanged(value),
      (err: any) => {},
      () => {}
    );
  }

  private getStateFromSocket(): void {
    this.socket.emit(
      WebClientEvents.RequestPlaylist,
      null,
      (data: TrackData[]) => (this.tracklist = data)
    );

    this.socket.emit(WebClientEvents.RequestPlaystate, null, (state: string) =>
      this.updatePlaystate(state)
    );
  }

  private updatePlaystate(state: string): void {
    const hackySpecifierString =
      state.charAt(0).toUpperCase() + state.substring(1).toLowerCase();
    // Can the param be the enum?
    const convertedState: PlayState = PlayState[hackySpecifierString];
    if (!convertedState) {
      return;
    }

    this.playstateSubject.next(convertedState);
    this.updateTitle(convertedState);
  }

  private handleSocketConnectionChanged(isConnected: boolean): void {
    if (!isConnected) {
      return;
    }

    this.getStateFromSocket();
  }

  private updateTitle(newState: PlayState) {
    if (newState === PlayState.Playing) {
      return this.titleService.setTitle('▶️');
    }

    if (newState === PlayState.Paused) {
      return this.titleService.setTitle('⏸');
    }

    this.titleService.resetTitle();
  }
}
