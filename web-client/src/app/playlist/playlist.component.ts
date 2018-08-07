import { Component } from '@angular/core';

import { AnimationSettings } from './playlist.component.transitions';
import { PlaylistService } from '../playlist.service';
import { TrackData } from 'jukebox-common';

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
export class PlaylistComponent {

  public snarkyEmptyPlaylistComment: string;
  public isPlaying: boolean;

  constructor(private playlist: PlaylistService) {
    this.isPlaying = false;
    this.updateEmptyPlaylistComment();
  }

  public get tracks(): TrackData[] {
    return this.playlist.tracks;
  }

  private updateEmptyPlaylistComment(): void {
    this.snarkyEmptyPlaylistComment = emptyComments[Math.floor(Math.random() * emptyComments.length)];
  }

}
