import { IMock, Mock, It, Times } from 'typemoq';

import { SocketService } from './socket.service';
import { PlaylistService } from './playlist.service';
import { WebClientEvents, PlayState, ServerEvents } from 'jukebox-common';

const mockTrack = {
  title: 'track1',
  album: 'albumForTrack1',
  artist: 'artistForTrack1',
  songId: 'track0',
  lengthMs: 1
};

describe('PlaylistService', () => {
  let mockSocketService: IMock<SocketService>;

  beforeEach(() => {
    mockSocketService = Mock.ofType<SocketService>();
  });

  it('should be created', () => {
    const service = new PlaylistService(mockSocketService.object);

    expect(service).toBeTruthy();
    expect(service.tracks).toEqual([]);
  });

  it('should request playlist and state on construction', () => {
    mockSocketService.setup(s => s.emit(It.isAny(), It.isAny(), It.isAny()));

    const service = new PlaylistService(mockSocketService.object);
    expect(service).toBeTruthy();

    mockSocketService.verify(
      s =>
        s.emit(
          It.isValue(WebClientEvents.RequestPlaylist),
          It.isValue(null),
          It.isAny()
        ),
      Times.once()
    );
    mockSocketService.verify(
      s =>
        s.emit(
          It.isValue(WebClientEvents.RequestPlaystate),
          It.isValue(null),
          It.isAny()
        ),
      Times.once()
    );
  });

  it('should toggle play state', () => {
    const service = new PlaylistService(mockSocketService.object);

    service.togglePlayState();

    mockSocketService.verify(
      s =>
        s.emit(
          It.isValue(WebClientEvents.ChangePlaystate),
          It.isValue('toggle')
        ),
      Times.once()
    );
  });

  it('should get play state', (done: DoneFn) => {
    const playStates = [PlayState.Playing, PlayState.Paused, PlayState.Stopped];
    const recordedStates: PlayState[] = [];

    const service = new PlaylistService(mockSocketService.object);

    service.playState$.subscribe(
      (state: PlayState) => {
        recordedStates.push(state);

        // Has an initial state, so ensure this is taken into account
        if (recordedStates.length === playStates.length + 1) {
          // Initial state is stopped so factor this into account
          expect(recordedStates).toEqual([PlayState.Stopped, ...playStates]);
          done();
        }
      },
      (err: Error) => fail(err),
      () => {}
    );

    playStates.forEach(state => {
      // Push onto the subject directly
      (service as any).playstateSubject.next(state);
    });
  });

  it('Should update play state when value is pushed to socket', (done: DoneFn) => {
    const playStates = [PlayState.Playing, PlayState.Paused, PlayState.Stopped];
    const recordedStates: PlayState[] = [];
    let eventRaiser: Function = null;

    mockSocketService
      .setup(s =>
        s.subscribe(It.isValue(ServerEvents.PlaystateChanged), It.isAny())
      )
      .callback((_, callback: Function) => (eventRaiser = callback));

    const service = new PlaylistService(mockSocketService.object);

    service.playState$.subscribe(
      (state: PlayState) => {
        recordedStates.push(state);

        // As above, has an initial state, so ensure this is taken into account
        if (recordedStates.length === playStates.length + 1) {
          expect(recordedStates).toEqual([PlayState.Stopped, ...playStates]);
          done();
        }
      },
      (err: Error) => fail(err),
      () => {}
    );

    playStates.forEach(state => {
      eventRaiser(state);
    });
  });

  it('should handle a track being queued', () => {
    let eventRaiser: Function = null;

    mockSocketService
      .setup(s => s.subscribe(It.isValue(ServerEvents.QueuedTrack), It.isAny()))
      .callback((_, callback: Function) => (eventRaiser = callback));

    const service = new PlaylistService(mockSocketService.object);

    eventRaiser(mockTrack);

    expect(service.tracks).toEqual([mockTrack]);
  });

  it('should handle an existing track being removed', (done: DoneFn) => {
    let eventRaiser: Function = null;

    mockSocketService
      .setup(s =>
        s.subscribe(It.isValue(ServerEvents.DequeuedTrack), It.isAny())
      )
      .callback((_, callback: Function) => (eventRaiser = callback));

    const service = new PlaylistService(mockSocketService.object);

    // Poke internal tracklist directly
    (service as any).tracklist = [mockTrack];

    eventRaiser(mockTrack.songId);

    setTimeout(() => {
      expect(service.tracks).not.toContain(mockTrack);
      done();
    });
  });

  it('should handle a non existing track being removed', (done: DoneFn) => {
    let eventRaiser: Function = null;

    mockSocketService
      .setup(s =>
        s.subscribe(It.isValue(ServerEvents.DequeuedTrack), It.isAny())
      )
      .callback((_, callback: Function) => (eventRaiser = callback));

    const service = new PlaylistService(mockSocketService.object);

    // Poke internal tracklist directly
    (service as any).tracklist = [mockTrack];

    eventRaiser('completelyDifferentId');

    setTimeout(() => {
      expect(service.tracks).toContain(mockTrack);
      done();
    });
  });
});
