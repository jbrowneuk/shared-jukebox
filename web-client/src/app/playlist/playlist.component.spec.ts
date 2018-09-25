import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { PlaylistComponent } from './playlist.component';
import { DurationPipe } from '../duration.pipe';
import { PlaylistService } from '../playlist.service';
import { BehaviorSubject } from 'rxjs';
import { PlayState, TrackData } from 'jukebox-common';

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

  it('should return track list', () => {
    const mockTracks: TrackData[] = [
      { title: 't', album: 'a', artist: 'r', songId: 'i', lengthMs: 5 }
    ];

    mockPlaylistService.setup(s => s.tracks).returns(() => mockTracks);
    const tracks = component.tracks;

    expect(tracks).toEqual(mockTracks);
  });

  it('should return playstate as observable', (done: DoneFn) => {
    const states = [PlayState.Playing, PlayState.Paused, PlayState.Stopped];
    const receivedStates = [];

    const sub = component.playState$.subscribe(
      (s: PlayState) => {
        receivedStates.push(s);

        // length + 1 as the initial state is recorded as well
        if (receivedStates.length < states.length + 1) {
          return;
        }

        expect(receivedStates).toEqual([PlayState.Stopped, ...states]);
        done();
      },
      (err: any) => fail(err),
      () => sub.unsubscribe()
    );

    states.forEach((state: PlayState) => {
      playStateSubject.next(state);
    });
  });
});
