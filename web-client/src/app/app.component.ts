import { Component, OnInit } from '@angular/core';
import { AnimationSettings } from './app.component.transitions';
import { SocketService } from './socket.service';

const loadingMessages = [
  'Adjusting the antenna',
  'Grabbing CDs from the flea market',
  'Torrenting tracks',
  'Putting cats in tubes',
  'Singing in the shower'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: AnimationSettings
})
export class AppComponent implements OnInit {

  public loadingMessage: string;
  private connectionState = 0;

  constructor(private socket: SocketService) {
    this.loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }

  ngOnInit() {
    this.socket.subscribe('playlist', () => {
      this.connectionState = 2;
    });

    this.socket.subscribe('disconnect', () => {
      this.connectionState = 3;
    });
  }

  public get shouldShowLogin(): boolean {
    return this.connectionState === 0;
  }

  public get shouldShowConnecting(): boolean {
    return this.connectionState === 1;
  }

  public get shouldShowJukebox(): boolean {
    return this.connectionState === 2;
  }

  public get wasDisconnected(): boolean {
    return this.connectionState === 3;
  }

  public onLogin(): void {
    this.connectionState = 1;
  }
}
