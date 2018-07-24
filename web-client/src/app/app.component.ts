import { Component } from '@angular/core';
import { AnimationSettings } from './app.component.transitions';

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
export class AppComponent {

  public loadingMessage: string;
  private connectionState = 0;

  constructor() {
    this.loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
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

  public onLogin(): void {
    this.connectionState = 1;
    setTimeout(() => { this.connectionState = 2; }, 1000);
  }
}
