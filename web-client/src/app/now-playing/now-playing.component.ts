import { Component } from '@angular/core';

import { AnimationSettings } from './now-playing.component.transitions';
import { PlaylistService } from '../playlist.service';
import { Observable } from 'rxjs';
import { PlayState, TrackData } from 'jukebox-common';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss'],
  animations: AnimationSettings
})
export class NowPlayingComponent {

  // For component template binding
  public PlayState = PlayState;

  constructor(private playlist: PlaylistService) { }

  public get playState$(): Observable<PlayState> {
    return this.playlist.playState$;
  }

  public get currentTrack(): TrackData {
    if (this.playlist.tracks.length === 0) {
      return null;
    }

    return this.playlist.tracks[0];
  }

  public onPlayClicked() {
    this.playlist.togglePlayState();
  }

}
