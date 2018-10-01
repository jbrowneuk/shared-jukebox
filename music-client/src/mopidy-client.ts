import * as Mopidy from 'mopidy';
import { EventEmitter } from 'events';
import { PlayState } from 'jukebox-common';

export const MopidyEvents = {
  Online: 'online',
  Offline: 'offline',
  TrackComplete: 'track-complete',
  PlayStateChanged: 'playstate-changed'
};

export class MopidyClient extends EventEmitter {
  private mopidy: any;
  private mopidyTrack: any;

  constructor(private mopidyUrl: string, private mopidyFactory?: (url: string) => any) {
    super();

    this.mopidy = null;
    this.mopidyTrack = null;

    if (!this.mopidyFactory) {
      this.mopidyFactory = (url: string) => {
        return new Mopidy({
          autoConnect: false,
          callingConvention: 'by-position-only',
          webSocketUrl: url
        });
      };
    }
  }

  public initialize(): void {
    this.mopidy = this.mopidyFactory(this.mopidyUrl);

    this.mopidy.on('state:online', () => {
      this.mopidy.tracklist.setConsume(true).then(() => {
        console.log('Attempted to set consume mode');
        this.mopidy.tracklist.clear().then(() => {
          console.log('Cleared playlist');
          this.emit(MopidyEvents.Online);
        });
      });
    });

    this.mopidy.on('state:offline', () => {
      this.emit(MopidyEvents.Offline);
    });

    this.mopidy.on('event:trackPlaybackStarted', (event: any) => {
      this.mopidyTrack = event.tl_track.track;
      this.emit(MopidyEvents.PlayStateChanged, PlayState.Playing);
    });

    this.mopidy.on('event:trackPlaybackEnded', () => {
      this.emit(MopidyEvents.TrackComplete, this.mopidyTrack.uri);
      this.mopidyTrack = null;
    });

    this.mopidy.on('event:playbackStateChanged', (event: any) => {
      const state = `${event.new_state}`;
      const newState = state.charAt(0).toUpperCase() + state.substring(1);
      const mappedState = PlayState[newState];
      console.log('MappedState:', mappedState);
      if (!mappedState) {
        console.log('Unsupported state');
        return;
      }

      this.emit(MopidyEvents.PlayStateChanged, mappedState);
    });

    this.mopidy.connect();
  }

  public queueTrack(url: string): Promise<void> {
    return this.mopidy.tracklist.add(null, null, url);
  }

  public clearTracks(): void {
    this.mopidy.tracklist.clear().then(() => {
      console.log('Cleared playlist');
      this.emit(MopidyEvents.Offline);
    });
  }

  public setPlayState(requestedState: PlayState): void {
    this.mopidy.playback.getState()
      .then((serverState: string) => {
        console.log('Server state:', serverState);
        console.log('Requested state:', requestedState);
        if (requestedState === PlayState.Playing && serverState !== PlayState.Playing) {
          console.log('-> play');
          return this.mopidy.playback.play();
        }

        if (requestedState === PlayState.Paused && serverState !== PlayState.Paused) {
          console.log('-> pause');
          return this.mopidy.playback.pause();
        }
      });
  }

  public skipTrack(): void {
    this.mopidy.playback.getState()
      .then((serverState: string) => {
        if (serverState === PlayState.Stopped) {
          return;
        }

        console.log('-> skip');
        this.mopidy.playback.next();
      });
  }
}
