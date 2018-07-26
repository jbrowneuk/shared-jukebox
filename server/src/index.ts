import * as express from 'express';
import * as http from 'http';
import * as io from 'socket.io';
import * as Haikunator from 'haikunator';
import * as SpotifyWebApi from 'spotify-web-api-node';

import { User, TrackData } from '../../shared/models';

const currentlySupportedVersion = 1;

const settings = {
  port: 8080
};

const app = express();
const server = http.createServer(app);
const socketServer = io(server);
const currentPlaylist: TrackData[] = [];
const haikunator = new Haikunator();

let spotifyApi: any;
let spotifyCredentialExpiry: Date;
let isPlaying = false;

function checkSpotifyCreds(): Promise<void> {
  if (!spotifyCredentialExpiry || spotifyCredentialExpiry < new Date()) {
    return spotifyApi.clientCredentialsGrant()
      .then((data) => {
        spotifyCredentialExpiry = new Date();
        const expiry = spotifyCredentialExpiry.getTime() + (data.body.expires_in * 1000);
        spotifyCredentialExpiry.setTime(expiry);
        spotifyApi.setAccessToken(data.body.access_token);
      });
  }

  return Promise.resolve(null);
}

function setupSpotify(): void {
  spotifyApi = new SpotifyWebApi({
    /*
 ______
(______)                      _
 _     _ ___     ____   ___ _| |_
| |   | / _ \   |  _ \ / _ (_   _)
| |__/ / |_| |  | | | | |_| || |_
|_____/ \___/   |_| |_|\___/  \__)

            _           _
           | |         (_)  _
  ___ _   _| |__  ____  _ _| |_
 /___) | | |  _ \|    \| (_   _)
|___ | |_| | |_) ) | | | | | |_
(___/|____/|____/|_|_|_|_|  \__)
    */
    clientId: '',
    clientSecret: ''
  });
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(express.static(__dirname + '/static'));

socketServer.on('connection', (socket: io.Socket) => {
  let userInfo: User;
  console.log('Client connected');
  socket.emit('client', undefined, data => {
    console.log('got client data');

    if (!data || !data.version || data.version < currentlySupportedVersion) {
      socket.emit('require-update', currentlySupportedVersion);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('login', (user: User, callback: Function) => {
    userInfo = user;

    if (!userInfo.name || userInfo.name === '') {
      userInfo.name = haikunator.haikunate({ tokenLength: 0, delimiter: ' ' });
    }

    if (callback) {
      callback(userInfo);
    }

    socket.emit('playlist', currentPlaylist);
  });

  socket.on('request', (trackInfo: TrackData, callback: Function) => {
    let username;
    if (!userInfo) {
      console.log('fake request!');
      username = 'Server test page';
    } else {
      username = userInfo.name;
    }

    const safeTrackInfo: TrackData = {
      title: trackInfo.title,
      album: trackInfo.album,
      artist: trackInfo.artist,
      songId: trackInfo.songId,
      requestedBy: username
    };

    currentPlaylist.push(safeTrackInfo);
    socketServer.emit('queued-track', safeTrackInfo);
    if (callback) {
      callback(safeTrackInfo.songId);
    }
  });

  socket.on('query', (data: string, callback: Function) => {
    if (!callback) {
      return;
    }

    const types = ['track'];
    checkSpotifyCreds().then(() => {
      return spotifyApi.search(data, types, {
        limit: 10,
        offset: 0
      }).then((data) => {
        const rawTrackData: any[] = data.body.tracks.items;
        const parsedTrackData: TrackData[] = rawTrackData.map(track => {
          return {
            title: track.name,
            album: track.album.name,
            artist: track.artists.map((artist) => artist.name).join(', '),
            songId: track.uri,
            requestedBy: ''
          };
        });

        callback(parsedTrackData);
      });
    }).catch(() => {
      callback(null);
    });
  });

  socket.on('get-playlist', (_, callback: Function) => {
    console.log(`Sending playlist with ${currentPlaylist.length} items`);
    callback(currentPlaylist);
  });

  socket.on('get-playstate', (__dirname, callback: Function) => {
    if (!callback) {
      return;
    }

    callback(isPlaying ? 'PLAYING' : 'PAUSED');
  });

  socket.on('change-playstate', () => {
    if (currentPlaylist.length === 0) {
      return;
    }

    console.log('got request to change playstate…');
    isPlaying = !isPlaying;
    setTimeout(() => {
      console.log('Faking changed play state');
      socket.emit('playstate-changed', isPlaying ? 'PLAYING' : 'PAUSED');
    }, 500);
  });
});

setupSpotify();

server.listen(settings.port, () => {
  console.log(`Server listening on port ${settings.port}`);
});
