import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should become larger when variable is specified', async(() => {
    component.isLarge = true;

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const spinnerElement = document.querySelector('.spinner');
      expect(spinnerElement.className).toContain('large');
      expect(spinnerElement.clientHeight).toEqual(64);
    });
  }));

  it('should pause animation when variable is specified', async(() => {
    component.isAnimated = false;

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const spinnerElement = document.querySelector('.spinner');
      expect(spinnerElement.className).not.toContain('animated');

      const barElement = document.querySelector('.spinner .bar');
      expect(window.getComputedStyle(barElement).animationPlayState).toEqual('paused');
    });
  }));
});
