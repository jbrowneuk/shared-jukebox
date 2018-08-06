import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { NowPlayingComponent } from './now-playing.component';
import { SocketService } from '../socket.service';

describe('NowPlayingComponent', () => {
  let mockSocketService: IMock<SocketService>;
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;

  beforeEach(async(() => {
    mockSocketService = Mock.ofType<SocketService>();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [NowPlayingComponent],
      providers: [
        { provide: SocketService, useFactory: () => mockSocketService.object }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NowPlayingComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
