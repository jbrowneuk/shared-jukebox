import { PlaylistWrapper } from './playlist-wrapper';
import { PlayState } from 'jukebox-common';

const mockTrackId = 'id12345';
const mockTrack = { title: 't', album: 'a', artist: 'r', songId: mockTrackId, lengthMs: 5 };

describe('Playlist wrapper', () => {
  function getTracklist() {
    return [mockTrack];
  }

  describe('initialisation', () => {
    it('should construct', () => {
      const service = new PlaylistWrapper();
      expect(service).toBeTruthy();
    });
  });

  describe('getTracks', () => {
    it('should return cached track data', () => {
      const service = new PlaylistWrapper();
      (service as any).playlist = getTracklist();

      expect(service.getTracks()).toEqual([mockTrack]);
    });
  });

  describe('getPlayState', () => {
    it('should return stopped as initial play state', () => {
      const service = new PlaylistWrapper();

      expect(service.getPlayState()).toBe(PlayState.Stopped);
    });

    it('should return play state when set', () => {
      const thePlayState = PlayState.Playing;

      const service = new PlaylistWrapper();
      (service as any).playstate = thePlayState;

      expect(service.getPlayState()).toBe(thePlayState);
    });
  });

  describe('togglePlayState', () => {
    it('should set stopped play state on empty playlist', () => {
      const service = new PlaylistWrapper();

      expect(service.getTracks().length).toEqual(0);

      service.togglePlaystate();

      expect(service.getPlayState()).toEqual(PlayState.Stopped);
    });

    it('should toggle to playing if paused', () => {
      const service = new PlaylistWrapper();
      const untypedSvc = service as any;
      untypedSvc.playstate = PlayState.Paused;
      untypedSvc.playlist = getTracklist();

      service.togglePlaystate();

      expect(service.getPlayState()).toEqual(PlayState.Playing);
    });

    it('should toggle to paused if playing', () => {
      const service = new PlaylistWrapper();
      const untypedSvc = service as any;
      untypedSvc.playstate = PlayState.Playing;
      untypedSvc.playlist = getTracklist();

      service.togglePlaystate();

      expect(service.getPlayState()).toEqual(PlayState.Paused);
    });
  });

  describe('setPlaystate', () => {
    it('should update internal playstate', () => {
      const service = new PlaylistWrapper();

      const states = [PlayState.Paused, PlayState.Playing, PlayState.Stopped];
      states.forEach((state) => {
        service.setPlaystate(state);
        expect(service.getPlayState()).toEqual(state);
      });
    });
  });

  describe('addTrack', () => {
    it('should add a track to the playlist', () => {
      const service = new PlaylistWrapper();
      expect(service.getTracks().length).toBe(0);

      service.addTrack(mockTrack);

      expect(service.getTracks()).toEqual([mockTrack]);
    });
  });

  describe('removeTrack', () => {
    it('should remove a track from the playlist if it exists', () => {
      const service = new PlaylistWrapper();
      (service as any).playlist = getTracklist();

      expect(service.getTracks()).toContain(mockTrack);

      service.removeTrack(mockTrack);

      expect(service.getTracks()).not.toContain(mockTrack);
    });

    it('should not remove any tracks from the playlist if it does not contain it', () => {
      const service = new PlaylistWrapper();
      (service as any).playlist = getTracklist();

      const badTrack = {title: 'bad', album: 'bad', artist: 'bad', songId: 'bad', lengthMs: 1242};
      service.removeTrack(badTrack);

      expect(service.getTracks()).toEqual([mockTrack]);
    });
  });

  describe('findTrackWithId', () => {
    it('should find a track with a specific id', () => {
      const service = new PlaylistWrapper();
      (service as any).playlist = getTracklist();

      const track = service.findTrackWithId(mockTrackId);

      expect(track).toEqual(mockTrack);
    });

    it('return a falsy value if id not found', () => {
      const service = new PlaylistWrapper();
      (service as any).playlist = getTracklist();

      const track = service.findTrackWithId('sagsfgsgsdfgdsfg');

      expect(track).toBeFalsy();
    });
  });
});
