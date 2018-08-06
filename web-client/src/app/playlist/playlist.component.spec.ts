import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { PlaylistComponent } from './playlist.component';
import { DurationPipe } from '../duration.pipe';
import { PlaylistService } from '../playlist.service';

describe('PlaylistComponent', () => {
  let mockSocketService: IMock<PlaylistService>;
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async(() => {
    mockSocketService = Mock.ofType<PlaylistService>();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [PlaylistComponent, DurationPipe],
      providers: [
        { provide: PlaylistService, useFactory: () => mockSocketService.object }
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
