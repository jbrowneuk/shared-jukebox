import { Component, OnInit, OnDestroy } from '@angular/core';

import { ServerEvents, WebClientEvents } from '../../../../shared/constants';

import { SocketService } from '../socket.service';
import { AnimationSettings } from './now-playing.component.transitions';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss'],
  animations: AnimationSettings
})
export class NowPlayingComponent implements OnInit, OnDestroy {

  public isPlaying: boolean;

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.socket.subscribe(ServerEvents.PlaystateChanged, (state: string) => this.updatePlaystate(state));
    this.socket.emit(WebClientEvents.RequestPlaystate, null, (state: string) => this.updatePlaystate(state));
  }

  ngOnDestroy() {
    this.socket.unsubscribe(ServerEvents.PlaystateChanged);
  }

  onPlayClicked() {
    this.socket.emit(WebClientEvents.ChangePlaystate, 'todo');
  }

  private updatePlaystate(state: string): void {
    this.isPlaying = state === 'PLAYING';
  }

}
