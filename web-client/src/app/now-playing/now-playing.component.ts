import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';

import { AnimationSettings } from './now-playing.component.transitions';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss'],
  animations: AnimationSettings
})
export class NowPlayingComponent implements OnInit {

  public isPlaying: boolean;

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.socket.subscribe('playstate-changed', (state: string) => this.updatePlaystate(state));
    this.socket.emit('get-playstate', null, (state: string) => this.updatePlaystate(state));
  }

  onPlayClicked() {
    this.socket.emit('change-playstate', 'todo');
  }

  private updatePlaystate(state: string): void {
    this.isPlaying = state === 'PLAYING';
  }

}
