export interface TrackData {
  title: string;
  album: string;
  artist: string;
  songId: string;
  lengthMs: number;
  requestedBy?: string; // Intent to deprecate
}

export interface ClientData {
  name: string;
  supportedApiVersion: number;
}
