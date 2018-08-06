export interface User {
  name: string;
}

export interface TrackData {
  title: string;
  album: string;
  artist: string;
  songId: string;
  requestedBy?: string; // Intent to deprecate
  trackLength?: any; // Intent to make mandatory
}

export interface ClientData {
  name: string;
  supportedApiVersion: number;
}
