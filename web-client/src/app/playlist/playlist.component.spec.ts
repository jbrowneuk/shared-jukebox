import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { PlaylistComponent } from './playlist.component';
import { SocketService } from '../socket.service';
import { DurationPipe } from '../duration.pipe';

describe('PlaylistComponent', () => {
  let mockSocketService: IMock<SocketService>;
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async(() => {
    mockSocketService = Mock.ofType<SocketService>();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [PlaylistComponent, DurationPipe],
      providers: [
        { provide: SocketService, useFactory: () => mockSocketService.object }
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
