import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {

  public isPlaying: boolean;

  constructor() { }

  ngOnInit() {
  }

  onPlayClicked() {
    console.log('Clicked play');
    this.isPlaying = !this.isPlaying;
  }

}
