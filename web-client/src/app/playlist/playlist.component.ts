import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { PlayState, TrackData } from 'jukebox-common';

import { AnimationSettings } from './playlist.component.transitions';
import { PlaylistService } from '../playlist.service';

const emptyComments = [
  'Or don’t. It’s not like I care.',
  'I shouldn’t have to state the obvious.',
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
export class PlaylistComponent implements OnDestroy {

  public readonly PlayState = PlayState; // For component template binding
  public snarkyEmptyPlaylistComment: string;

  private playstateSubscription: Subscription;

  constructor(private playlist: PlaylistService) {
    this.playstateSubscription = playlist.playState$.subscribe(
      (newState: PlayState) => this.handlePlayStateChange(newState),
      (err: any) => {},
      () => {}
    );
  }

  public ngOnDestroy(): void {
    this.playstateSubscription.unsubscribe();
  }

  public get tracks(): TrackData[] {
    return this.playlist.tracks;
  }

  public get playState$(): Observable<PlayState> {
    return this.playlist.playState$;
  }

  private handlePlayStateChange(state: PlayState): void {
    if (state !== PlayState.Stopped) {
      return;
    }

    this.snarkyEmptyPlaylistComment = emptyComments[Math.floor(Math.random() * emptyComments.length)];
  }

}
