import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class IdentityComponent implements OnInit {

  @Output() public login: EventEmitter<void>;
  public userName: string;

  constructor() {
    this.userName = '';
    this.login = new EventEmitter<void>();
  }

  ngOnInit() {
    // Get username from cookie?
  }

  onConnectClick(): void {
    console.log(this.userName);
    this.login.emit();
  }

}
