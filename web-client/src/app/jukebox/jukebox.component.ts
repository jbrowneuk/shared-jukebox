import { Component } from '@angular/core';

import { AnimationSettings } from '../common.transitions';

@Component({
  selector: 'app-jukebox',
  templateUrl: './jukebox.component.html',
  styleUrls: ['./jukebox.component.scss'],
  animations: AnimationSettings
})
export class JukeboxComponent {

  public searchTerm: string;
  public isSearchFocus: boolean;

  constructor() {
    this.searchTerm = '';
    this.isSearchFocus = false;
  }

  public get shouldShowSearchResults(): boolean {
    return this.isSearchFocus;
  }

  public onSearchButtonClicked(): void {
    if (this.searchTerm.length === 0) {
      return;
    }

    this.searchTerm = '';
    this.isSearchFocus = false;
  }

  public onFocusSearch(): void {
    this.isSearchFocus = true;
  }

  public onResultsClosed(): void {
    this.isSearchFocus = false;
  }

}
