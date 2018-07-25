import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

import { User } from '../../../shared/models';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject: BehaviorSubject<User>;

  constructor(private socket: SocketService) {
    this.userSubject = new BehaviorSubject<User>(null);
  }

  public authenticate(name: string): void {
    this.socket.emit('login', { name }, (user: User) => this.onUserAcknowledged(user));
  }

  private onUserAcknowledged(user: User): void {
    this.userSubject.next(user);
  }

  public currentUser$(): Observable<User> {
    return this.userSubject.asObservable();
  }
}
