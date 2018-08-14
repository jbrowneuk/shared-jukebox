import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock, It } from 'typemoq';
import { BehaviorSubject } from 'rxjs';

import { AppComponent } from './app.component';
import { SocketService } from './socket.service';
import { ServerEvents } from 'jukebox-common';

describe('AppComponent', () => {
  let mockSocketService: IMock<SocketService>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockConnectionSubject: BehaviorSubject<boolean>;

  beforeEach(async(() => {
    mockConnectionSubject = new BehaviorSubject<boolean>(true);

    mockSocketService = Mock.ofType<SocketService>();
    mockSocketService
      .setup(m => m.connection$)
      .returns(() => mockConnectionSubject.asObservable());

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AppComponent],
      providers: [
        { provide: SocketService, useFactory: () => mockSocketService.object }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should not report outdated state if socket has not sent outdated message', async(() => {
    mockSocketService.setup(m => m.subscribe(It.isValue(ServerEvents.ClientOutdated), It.isAny()));
    component.ngOnInit();

    setTimeout(() => {
      expect(component.requiresUpdate).toBe(false);
    });
  }));

  it('should report outdated state if socket has sent outdated message', async(() => {
    let callbackFunc: Function = null;
    mockSocketService.setup(m => m.subscribe(It.isValue(ServerEvents.ClientOutdated), It.isAny()))
      .callback((_, func: Function) => callbackFunc = func);

    component.ngOnInit();
    callbackFunc.call(component);

    setTimeout(() => {
      expect(component.requiresUpdate).toBe(true);
    });
  }));

  it('should display disconnected message when disconnected', async(() => {
    mockConnectionSubject.next(false);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const relatedElement = document.querySelector('[data-identifier=disconnected-message]');
      expect(relatedElement).toBeTruthy();
    });
  }));
});
