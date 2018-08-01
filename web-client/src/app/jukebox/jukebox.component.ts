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

  constructor(private userService: UserService) {
    this.showLogin = true;
  }

  public get isUserAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  public onIdentifyClicked(): void {
    this.showLogin = true;
  }

  public onLoginClicked(): void {
    this.showLogin = false;
  }

}
