import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AppComponent } from './app.component';
import { SocketService } from './socket.service';
import { UserService } from './user.service';

describe('AppComponent', () => {
  let mockSocketService: IMock<SocketService>;
  let mockUserService: IMock<UserService>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    mockSocketService = Mock.ofType<SocketService>();
    mockSocketService
      .setup(m => m.connection$)
      .returns(() => of(true).pipe(delay(4)));
    mockUserService = Mock.ofType<UserService>();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AppComponent],
      providers: [
        { provide: SocketService, useFactory: () => mockSocketService.object },
        { provide: UserService, useFactory: () => mockUserService.object }
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
});
