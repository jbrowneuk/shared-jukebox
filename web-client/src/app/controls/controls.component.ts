import { Component } from '@angular/core';

import { AnimationSettings } from './controls.component.transitions';
import { PlaylistService } from '../playlist.service';
import { Observable } from 'rxjs';
import { PlayState, TrackData } from 'jukebox-common';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  animations: AnimationSettings
})
export class ControlsComponent {

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

  public onPlayClicked(): void {
    this.playlist.togglePlayState();
  }

  public onSkipClicked(): void {
    this.playlist.skipTrack();
  }

}
