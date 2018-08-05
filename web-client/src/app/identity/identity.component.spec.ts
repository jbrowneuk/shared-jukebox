import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock } from 'typemoq';

import { UserService } from '../user.service';

import { IdentityComponent } from './identity.component';

describe('IdentityComponent', () => {
  let mockUserService: IMock<UserService>;
  let component: IdentityComponent;
  let fixture: ComponentFixture<IdentityComponent>;

  beforeEach(async(() => {
    mockUserService = Mock.ofType<UserService>();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [IdentityComponent],
      providers: [
        { provide: UserService, useFactory: () => mockUserService.object }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(IdentityComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
