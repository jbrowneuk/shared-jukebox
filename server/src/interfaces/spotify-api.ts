import { TrackData } from 'jukebox-common';

export interface SpotifyApi {
  search(term: string): Promise<TrackData>;
}
