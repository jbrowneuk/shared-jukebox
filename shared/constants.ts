export const ServerEvents = {
  RequestClientInfo: 'client',
  ClientOutdated: 'require-update',
  ClientSentLogin: 'login',
  SearchQuery: 'query',
  SongRequest: 'request',
  QueuedTrack: 'queued-track',
  RequestPlaylist: 'get-playlist',
  RequestPlaystate: 'get-playstate',
  ChangePlaystate: 'change-playstate',
  PlaystateChanged: 'playstate-changed'
};

export const MusicClientEvents = {
  SetPlaystate: 'set-playstate'
};
