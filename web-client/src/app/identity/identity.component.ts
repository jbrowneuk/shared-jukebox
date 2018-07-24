import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class IdentityComponent implements OnInit {

  @Output() public login: EventEmitter<void>;
  public userName: string;

  constructor(private socket: SocketService) {
    this.userName = '';
    this.login = new EventEmitter<void>();
  }

  ngOnInit() {
    // Get username from cookie?
  }

  onConnectClick(): void {
    this.socket.emit('login', { name: this.userName });
    this.login.emit();
  }

}
