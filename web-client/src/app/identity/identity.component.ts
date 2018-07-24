import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class IdentityComponent implements OnInit {

  @Output() public login: EventEmitter<void>;
  public userName: string;

  constructor(private userService: UserService) {
    this.userName = '';
    this.login = new EventEmitter<void>();
  }

  ngOnInit() {
    // Get username from cookie?
  }

  public onConnectClick(): void {
    this.userService.authenticate(this.userName);
    this.login.emit();
  }

}
