import { Component, OnInit } from '@angular/core';
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
export class PlaylistComponent implements OnInit {

  public playlist: any[];
  public snarkyEmptyPlaylistComment: string;

  private testInterval: any;

  constructor() {
    this.playlist = [];
    this.updateEmptyPlaylistComment();
  }

  ngOnInit() {
    this.fakeSetup();
  }

  private updateEmptyPlaylistComment(): void {
    this.snarkyEmptyPlaylistComment = emptyComments[Math.floor(Math.random() * emptyComments.length)];
  }

  private fakeSetup(): void {
    this.playlist.push({
      title: 'Feels pretty good',
      artist: 'TWRP',
      album: 'Together through time',
      spotifyId: '1234',
      requestedBy: 'Not you'
    });
    this.playlist.push({
      title: 'Holding On',
      artist: 'Tracey Chattaway',
      album: 'Nightsky',
      spotifyId: '1235',
      requestedBy: 'Jimmy'
    });
    this.playlist.push({
      title: 'Let It Go - From "Frozen"',
      artist: 'Idina Menzel',
      album: 'Frozen (Original Motion Picture Soundtrack)',
      spotifyId: '1236',
      requestedBy: 'benwells'
    });

    this.testInterval = setInterval(() => this.fakeRemoveTrack(), 5000);
  }

  private fakeRemoveTrack(): void {
    if (this.playlist.length === 0) {
      clearInterval(this.testInterval);
      this.updateEmptyPlaylistComment();
      this.fakeSetup();
      return;
    }
    this.playlist.splice(0, 1);
  }

}
