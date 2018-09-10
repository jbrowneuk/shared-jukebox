import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { PlaylistComponent } from './playlist.component';
import { DurationPipe } from '../duration.pipe';
import { PlaylistService } from '../playlist.service';
import { BehaviorSubject } from 'rxjs';
import { PlayState } from 'jukebox-common';

describe('PlaylistComponent', () => {
  let mockPlaylistService: IMock<PlaylistService>;
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;
  let playStateSubject: BehaviorSubject<PlayState>;

  beforeEach(async(() => {
    playStateSubject = new BehaviorSubject<PlayState>(PlayState.Stopped);

    mockPlaylistService = Mock.ofType<PlaylistService>();
    mockPlaylistService.setup(s => s.playState$).returns(() => playStateSubject.asObservable());

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [PlaylistComponent, DurationPipe],
      providers: [
        { provide: PlaylistService, useFactory: () => mockPlaylistService.object }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlaylistComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
