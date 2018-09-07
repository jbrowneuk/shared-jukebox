import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { PlaylistComponent } from './playlist.component';
import { DurationPipe } from '../duration.pipe';
import { PlaylistService } from '../playlist.service';

describe('PlaylistComponent', () => {
  let mockPlaylistService: IMock<PlaylistService>;
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async(() => {
    mockPlaylistService = Mock.ofType<PlaylistService>();

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
        clearInterval((component as any).commentRefreshInterval);
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
