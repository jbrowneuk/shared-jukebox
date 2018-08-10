import { Component } from '@angular/core';

import { AnimationSettings } from './playlist.component.transitions';
import { PlaylistService } from '../playlist.service';
import { Observable } from 'rxjs';
import { PlayState, TrackData } from 'jukebox-common';

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
export class PlaylistComponent {

  // For component template binding
  public PlayState = PlayState;

  public snarkyEmptyPlaylistComment: string;

  constructor(private playlist: PlaylistService) {
    this.updateEmptyPlaylistComment();
  }

  public get tracks(): TrackData[] {
    return this.playlist.tracks;
  }

  public get playState$(): Observable<PlayState> {
    return this.playlist.playState$;
  }

  private updateEmptyPlaylistComment(): void {
    this.snarkyEmptyPlaylistComment = emptyComments[Math.floor(Math.random() * emptyComments.length)];
  }

}
