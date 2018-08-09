import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock, Times } from 'typemoq';
import { of } from 'rxjs';

import { PlayState } from 'jukebox-common';
import { PlaylistService } from '../playlist.service';

import { NowPlayingComponent } from './now-playing.component';

const mockTracks = [
  {
    title: 'track1',
    album: 'albumForTrack1',
    artist: 'artistForTrack1',
    songId: 'track0',
    lengthMs: 1
  },
  {
    title: 'track2',
    album: 'albumForTrack2',
    artist: 'artistForTrack2',
    songId: 'track1',
    lengthMs: 2
  },
  {
    title: 'track3',
    album: 'albumForTrack3',
    artist: 'artistForTrack3',
    songId: 'track2',
    lengthMs: 3
  }
];

describe('NowPlayingComponent', () => {
  let mockPlaylistService: IMock<PlaylistService>;
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;

  beforeEach(async(() => {
    mockPlaylistService = Mock.ofType<PlaylistService>();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [NowPlayingComponent],
      providers: [
        { provide: PlaylistService, useFactory: () => mockPlaylistService.object }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NowPlayingComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should proxy first track in playlist from service', () => {
    mockPlaylistService.setup(s => s.tracks).returns(() => mockTracks);
    expect(component.currentTrack).toEqual(mockTracks[0]);
  });

  it('should toggle play state on service', (done: DoneFn) => {
    mockPlaylistService.setup(s => s.playState$).returns(() => of(PlayState.Stopped));
    mockPlaylistService.setup(s => s.togglePlayState());

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const button = fixture.nativeElement.querySelector('[data-identifier=play-pause-button]') as HTMLButtonElement;
      button.click();

      mockPlaylistService.verify(s => s.togglePlayState(), Times.once());

      done();
    });
  });
});
