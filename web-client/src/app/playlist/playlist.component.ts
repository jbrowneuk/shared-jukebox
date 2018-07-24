import { Component, OnInit } from '@angular/core';
import { AnimationSettings } from './playlist.component.transitions';
import { SocketService } from '../socket.service';
import { TrackData } from '../../../../shared/models';

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

  public playlist: TrackData[];
  public snarkyEmptyPlaylistComment: string;

  constructor(private socket: SocketService) {
    this.playlist = [];
    this.updateEmptyPlaylistComment();
  }

  ngOnInit() {
    this.socket.subscribe('playlist', (data: TrackData[]) => {
      this.playlist = data;
      this.updateEmptyPlaylistComment();
    });

    this.socket.subscribe('queued-track', (data: TrackData) => {
      this.playlist.push(data);
    });
  }

  private updateEmptyPlaylistComment(): void {
    this.snarkyEmptyPlaylistComment = emptyComments[Math.floor(Math.random() * emptyComments.length)];
  }

}
