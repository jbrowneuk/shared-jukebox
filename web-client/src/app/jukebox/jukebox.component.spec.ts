import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component, Output, EventEmitter } from '@angular/core';

import { JukeboxComponent } from './jukebox.component';
import { By } from '../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-search',
  template: '<p>test component</p>'
})
class MockSearchAreaComponent {
  @Output() closeResults: EventEmitter<void>;

  constructor() {
    this.closeResults = new EventEmitter();
  }
}

describe('JukeboxComponent', () => {
  let component: JukeboxComponent;
  let fixture: ComponentFixture<JukeboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [JukeboxComponent, MockSearchAreaComponent],
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

  it('should show search area when search is focussed', async(() => {
    expect(component.isSearchFocus).toBe(false);

    const searchInputElement = document.querySelector('[data-identifier=search-box]') as HTMLInputElement;
    searchInputElement.focus();
    searchInputElement.dispatchEvent(new FocusEvent('focus'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isSearchFocus).toBe(true);
    });
  }));

  it('should hide search area when search close is raised', async(() => {
    component.isSearchFocus = true;

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const searchResultsComponent = fixture.debugElement.query(By.directive(MockSearchAreaComponent));
      searchResultsComponent.componentInstance.closeResults.emit();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.isSearchFocus).toBe(false);
      });
    });
  }));

  it('should clear search and close results when clear button in search input is clicked', async(() => {
    component.isSearchFocus = true;
    component.searchTerm = 'SEARCH';

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let searchResultsComponent = fixture.debugElement.query(By.directive(MockSearchAreaComponent));
      expect(searchResultsComponent).toBeTruthy();

      const searchButton = document.querySelector('[data-identifier=search-input-button]') as HTMLButtonElement;
      searchButton.click();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        searchResultsComponent = fixture.debugElement.query(By.directive(MockSearchAreaComponent));
        expect(searchResultsComponent).toBeFalsy();
      });
    });
  }));
});
