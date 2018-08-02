import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { UserService } from '../user.service';

import { JukeboxComponent } from './jukebox.component';

describe('JukeboxComponent', () => {
  let mockUserService: IMock<UserService>;
  let component: JukeboxComponent;
  let fixture: ComponentFixture<JukeboxComponent>;

  beforeEach(async(() => {
    mockUserService = Mock.ofType<UserService>();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [JukeboxComponent],
      providers: [
        { provide: UserService, useFactory: () => mockUserService.object }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(JukeboxComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
