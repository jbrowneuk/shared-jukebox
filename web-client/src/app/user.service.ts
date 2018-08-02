import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

import { User, WebClientEvents } from 'jukebox-common';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isConnected: boolean;
  private userSubject: BehaviorSubject<User>;
  private hasUserInfo: boolean;
  private connectionSubscription: Subscription;

  constructor(private socket: SocketService) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.hasUserInfo = false;
    this.connectionSubscription = socket.connection$.subscribe(
      (value: boolean) => this.handleConnectivityChanged(value),
      (err: any) => this.handleConnectivityChanged(false),
      () => this.connectionSubscription.unsubscribe()
    );
  }

  public authenticate(name: string): void {
    this.socket.emit(WebClientEvents.ClientSentLogin, { name }, (user: User) => this.onUserAcknowledged(user));
  }

  public currentUser$(): Observable<User> {
    return this.userSubject.asObservable();
  }

  public isAuthenticated(): boolean {
    return this.hasUserInfo;
  }

  private onUserAcknowledged(user: User): void {
    if (user === null) {
      return;
    }

    this.userSubject.next(user);
    this.hasUserInfo = true;
  }

  private handleConnectivityChanged(isConnected: boolean): void {
    if (!isConnected) {
      this.hasUserInfo = false;
    }
  }
}
