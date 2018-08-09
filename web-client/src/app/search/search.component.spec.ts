import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IMock, Mock, It, Times } from 'typemoq';

import { DurationPipe } from '../duration.pipe';
import { SocketService } from '../socket.service';

import { SearchComponent } from './search.component';
import { TrackData, WebClientEvents } from 'jukebox-common';

const searchTimeout = 500;

const mockResults: TrackData[] = [
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

describe('SearchComponent', () => {
  let socketService: IMock<SocketService>;
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    socketService = Mock.ofType<SocketService>();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [SearchComponent, DurationPipe],
      providers: [
        { provide: SocketService, useFactory: () => socketService.object }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should raise close event when close button is clicked', (done: DoneFn) => {
    component.closeResults.subscribe(
      () => {
        done();
      },
      (err: any) => fail(err),
      () => {}
    );

    const closeButtonElement = fixture.nativeElement.querySelector(
      '[data-identifier=close-search-pane]'
    );
    closeButtonElement.click();
  });

  it(
    'should not perform search when term is set to a blank value',
    fakeAsync(() => {
      const spy = spyOn(component as any, 'performSearchRequest');

      component.searchTerm = '';
      tick(searchTimeout + 1);

      expect(spy).not.toHaveBeenCalled();
      expect(component.results).toEqual([]);
    })
  );

  it(
    'should perform search when term is set no a non-blank value',
    fakeAsync(() => {
      const spy = spyOn(component as any, 'performSearchRequest');

      component.searchTerm = 'TEST';
      tick(searchTimeout + 1);

      expect(spy).toHaveBeenCalled();
    })
  );

  it(
    'should stall search when term is set no a non-blank value and updated before timeout',
    fakeAsync(() => {
      const spy = spyOn(component as any, 'performSearchRequest');

      component.searchTerm = 'TE';
      tick(searchTimeout / 2);

      expect(spy).not.toHaveBeenCalled();

      component.searchTerm = 'TEST'; // Resets timeout
      tick(searchTimeout / 2);

      expect(spy).not.toHaveBeenCalled(); // Timeout not reached after reset
      tick(searchTimeout + 1);

      expect(spy).toHaveBeenCalled(); // Timeout reached search was called
    })
  );

  it('should return stored search term', () => {
    const value = 'Jackson 5';
    (component as any).cachedTerm = value;

    expect(component.searchTerm).toBe(value);
  });

  it('should queue track when result is clicked', (done: DoneFn) => {
    const mockSongIndex = 1;
    component.results = mockResults.map(
      r => [r, false] as [TrackData, boolean]
    );

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const relatedButton = fixture.nativeElement.querySelector(
        `[data-identifier=result-${mockSongIndex}]`
      ) as HTMLButtonElement;
      relatedButton.click();

      socketService.verify(
        s =>
          s.emit(
            It.isValue(WebClientEvents.SongRequest),
            It.isValue(mockResults[mockSongIndex]),
            It.isAny()
          ),
        Times.once()
      );

      done();
    });
  });

  it('should disable button for track that has just been added', fakeAsync(() => {
    socketService.setup(
      s =>
        s.emit(
          It.isValue(WebClientEvents.SongRequest),
          It.isAny(),
          It.isAny()
        )
    ).callback((message, relatedTrack, func: Function) => {
      func(relatedTrack);
    });

    const mockSongIndex = 1;
    component.results = mockResults.map(
      r => [r, false] as [TrackData, boolean]
    );

    tick();
    fixture.detectChanges();

    // Click search term
    const relatedButton = fixture.nativeElement.querySelector(
      `[data-identifier=result-${mockSongIndex}]`
    ) as HTMLButtonElement;
    relatedButton.click();

    tick();
    fixture.detectChanges();

    expect(relatedButton.disabled).toBe(true);
  }));

  it('should emit search term to socket and process results', fakeAsync(() => {
    socketService.setup(
      s => s.emit(It.isValue(WebClientEvents.SearchQuery), It.isAny(), It.isAny())
    ).callback((message, term, callback: Function) => {
      callback(mockResults);
    });

    component.searchTerm = 'anything';

    tick(searchTimeout + 1);
    fixture.detectChanges();

    const results = (fixture.nativeElement as HTMLElement).querySelectorAll('button[data-identifier|=result-]');
    for (let iterator = 0; iterator < results.length; iterator += 1) {
      const expectedTrackData = mockResults[iterator];

      const getElementWithIdentifier = (identifier: string) => results[iterator].querySelector(`[data-identifier=${identifier}]`);
      expect(getElementWithIdentifier('track-title').textContent).toBe(expectedTrackData.title);
      expect(getElementWithIdentifier('track-artist').textContent).toBe(expectedTrackData.artist);
      expect(getElementWithIdentifier('track-album').textContent).toBe(expectedTrackData.album);

      const actualResultsTuple = component.results[iterator];
      expect(actualResultsTuple[0]).toEqual(expectedTrackData);
      expect(actualResultsTuple[1]).toBe(false);
    }
  }));

  it('should block search if still processing results', fakeAsync(() => {
    const emulatedBlockingTime = searchTimeout * 2;

    socketService.setup(
      s => s.emit(It.isValue(WebClientEvents.SearchQuery), It.isAny(), It.isAny())
    ).callback((message, term, callback: Function) => {
      setTimeout(() => callback([]), emulatedBlockingTime);
    });

    const firstTerm = 'one';
    const secondterm = 'two';

    component.searchTerm = firstTerm;
    tick(searchTimeout);

    socketService.verify(s => s.emit(It.isAny(), It.isValue(firstTerm), It.isAny()), Times.once());

    component.searchTerm = secondterm;
    socketService.verify(s => s.emit(It.isAny(), It.isValue(secondterm), It.isAny()), Times.never());

    // Still blocked by first “slow’ results fetch
    tick(searchTimeout);
    socketService.verify(s => s.emit(It.isAny(), It.isValue(secondterm), It.isAny()), Times.never());

    // Should have completed first search and returned the second
    tick(emulatedBlockingTime);
    socketService.verify(s => s.emit(It.isAny(), It.isValue(secondterm), It.isAny()), Times.once());
  }));
});
