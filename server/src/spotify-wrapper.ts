import * as SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyApi } from './interfaces/spotify-api';
import { TrackData } from 'jukebox-common';

export class SpotifyWrapper implements SpotifyApi {
  private spotifyApi: any;
  private credentialExpiry: Date;

  public initialize(clientId: string, clientSecret: string): void {
    this.spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret
    });
  }

  public search(term: string): Promise<TrackData> {
    const types = ['track'];
    const options = { limit: 10, offset: 0 };

    return this.checkCredentials().then(() => {
      return this.spotifyApi.search(term, types, options).then((data: any) => {
        const rawTrackData: any[] = data.body.tracks.items;
        const parsedTrackData: TrackData[] = rawTrackData.map(track => {
          return {
            title: track.name,
            album: track.album.name,
            artist: track.artists.map(artist => artist.name).join(', '),
            songId: track.uri,
            requestedBy: ''
          };
        });

        return parsedTrackData;
      });
    });
  }

  private checkCredentials(): Promise<void> {
    if (!this.credentialExpiry || this.credentialExpiry < new Date()) {
      return this.spotifyApi.clientCredentialsGrant().then(data => {
        this.credentialExpiry = new Date();
        const expiry =
          this.credentialExpiry.getTime() + data.body.expires_in * 1000;
        this.credentialExpiry.setTime(expiry);
        this.spotifyApi.setAccessToken(data.body.access_token);
      });
    }

    return Promise.resolve(null);
  }
}
