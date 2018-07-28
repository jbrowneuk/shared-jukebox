import { Component, OnInit, OnDestroy } from '@angular/core';

import { TrackData, ServerEvents, WebClientEvents } from 'jukebox-common';

import { SocketService } from '../socket.service';
import { AnimationSettings } from './playlist.component.transitions';

const emptyComments = [
  'Or don’t. It’s not like I care.',
  'I should’t have to state the obvious.',
  'One song is better than none.',
  'Combined, your tastes in music are terrible. But hey, let’s do this anyway.',
  'Remember when we played some music? That bit was fun.',
  'Hey. Listen. Hey. Listen. Listen. Can you hear the silence too?',
  'Am I right, or am I right?'
];

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  animations: AnimationSettings
})
export class PlaylistComponent implements OnInit, OnDestroy {

  public playlist: TrackData[];
  public snarkyEmptyPlaylistComment: string;
  public isPlaying: boolean;

  private subscriptions: SocketIOClient.Emitter[];

  constructor(private socket: SocketService) {
    this.playlist = [];
    this.isPlaying = false;
    this.updateEmptyPlaylistComment();
  }

  ngOnInit() {
    this.socket.subscribe(ServerEvents.QueuedTrack, (data: TrackData) => {
      this.playlist.push(data);
    });

    this.socket.subscribe(ServerEvents.DequeuedTrack, (songId: string) => {
      const relatedTrackInfo = this.playlist.findIndex(s => s.songId === songId);
      if (relatedTrackInfo < 0) {
        return;
      }

      this.playlist.splice(relatedTrackInfo, 1);
    });

    this.socket.subscribe(ServerEvents.PlaystateChanged, (state: string) => this.updatePlaystate(state));

    this.socket.emit(WebClientEvents.RequestPlaylist, null, (data: TrackData[]) => {
      console.log(`Got a playlist with ${data.length} items`);
      this.playlist = data;
      this.updateEmptyPlaylistComment();
    });

    this.socket.emit(WebClientEvents.RequestPlaystate, null, (state: string) => this.updatePlaystate(state));
  }

  ngOnDestroy() {
    this.socket.unsubscribe(ServerEvents.QueuedTrack);
    this.socket.unsubscribe(ServerEvents.DequeuedTrack);
    this.socket.unsubscribe(ServerEvents.PlaystateChanged);
  }

  private updateEmptyPlaylistComment(): void {
    this.snarkyEmptyPlaylistComment = emptyComments[Math.floor(Math.random() * emptyComments.length)];
  }

  private updatePlaystate(state: string): void {
    this.isPlaying = state === 'PLAYING';
  }

}
