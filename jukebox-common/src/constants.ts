export const ServerEvents = {
  RequestClientInfo: 'client',
  ClientOutdated: 'require-update',
  QueuedTrack: 'queued-track',
  DequeuedTrack: 'dequeued-track',
  PlaystateChanged: 'playstate-changed'
};

export const WebClientEvents = {
  ClientSentLogin: 'login',
  RequestPlaylist: 'get-playlist',
  RequestPlaystate: 'get-playstate',
  SearchQuery: 'query',
  SongRequest: 'request',
  ChangePlaystate: 'change-playstate',
  SongSkip: 'skip'
}

export const MusicClientEvents = {
  SetPlaystate: 'set-playstate',
  DequeueTrack: 'dequeue-track',
  ChangedPlayState: 'changed-playstate',
  SkipTrack: 'skip-track'
};

export enum PlayState {
  Stopped = 'stopped',
  Paused = 'paused',
  Playing = 'playing'
}
