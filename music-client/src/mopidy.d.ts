declare var mopidy: Mopidy;

declare module 'mopidy' {
  export = mopidy;
}

declare class TrackList {
  add(something: any, somthingelse: any, url: string);
  clear(): Promise<void>;
  setConsume(consume: boolean): Promise<void>;
}

declare class Playback {
  getState(): Promise<string>;
  play(): Promise<void>;
  pause(): Promise<void>;
  next(): Promise<void>;
}

declare class Mopidy {
  playback: Playback;
  tracklist: TrackList;

  constructor(options: any);
  on(event: string, callback: any);
  connect();
}
