import { TrackData } from '../../../shared/models';

export interface SpotifyApi {
  search(term: string): Promise<TrackData>;
}
