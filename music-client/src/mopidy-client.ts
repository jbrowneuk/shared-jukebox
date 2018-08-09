import * as Mopidy from 'mopidy';
import { EventEmitter } from 'events';
import { PlayState } from 'jukebox-common';

export const MopidyEvents = {
  Online: 'online',
  Offline: 'offline',
  TrackComplete: 'track-complete',
  PlayStateChanged: 'playstate-changed'
}

export class MopidyClient extends EventEmitter {
  private mopidy: any;
  private mopidyTrack: any;

  constructor(private mopidyUrl: string) {
    super();

    this.mopidy = null;
    this.mopidyTrack = null;
  }

  public initialize(): void {
    this.mopidy = new Mopidy({
      autoConnect: false,
      callingConvention: 'by-position-only',
      webSocketUrl: this.mopidyUrl
    });

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
    })

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
      })
  }
}
