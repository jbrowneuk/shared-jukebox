import { Component } from '@angular/core';
import { UserService } from '../user.service';

import { AnimationSettings } from '../common.transitions';

@Component({
  selector: 'app-jukebox',
  templateUrl: './jukebox.component.html',
  styleUrls: ['./jukebox.component.scss'],
  animations: AnimationSettings
})
export class JukeboxComponent {

  public showLogin: boolean;
  public searchTerm: string;
  public isSearchFocus: boolean;

  constructor(private userService: UserService) {
    this.showLogin = true;
    this.searchTerm = '';
    this.isSearchFocus = false;
  }

  public get isUserAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  public get shouldShowPlaylist(): boolean {
    return !this.isSearchFocus && this.searchTerm.length === 0;
  }

  public get shouldShowSearchResults(): boolean {
    return this.isSearchFocus || this.searchTerm.length > 0;
  }

  public onLoginClicked(): void {
    this.showLogin = false;
  }

  public onFocusSearch(): void {
    this.isSearchFocus = true;
  }

  public onBlurSearch(): void {
    this.isSearchFocus = false;
  }

}
