import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { NowPlayingComponent } from './now-playing.component';
import { PlaylistService } from '../playlist.service';

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
});
