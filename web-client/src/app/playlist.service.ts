import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { PlayState } from 'jukebox-common';

import { TrackData, ServerEvents, WebClientEvents } from 'jukebox-common';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private tracklist: TrackData[];
  private playstateSubject: BehaviorSubject<PlayState>;

  constructor(private socket: SocketService) {
    this.tracklist = [];
    this.playstateSubject = new BehaviorSubject<PlayState>(PlayState.Stopped);

    this.subscribeToSocket();
    this.getStateFromSocket();
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
    const convertedState = PlayState[hackySpecifierString];
    if (!convertedState) {
      return;
    }

    this.playstateSubject.next(convertedState);
  }
}
