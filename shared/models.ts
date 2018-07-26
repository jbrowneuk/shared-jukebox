export interface User {
  name: string;
}

export interface TrackData {
  title: string;
  album: string;
  artist: string;
  songId: string;
  requestedBy: string;
}

export interface ClientData {
  name: string;
  supportedApiVersion: number;
}
