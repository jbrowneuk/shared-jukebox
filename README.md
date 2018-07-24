# shared-jukebox
A collaborative jukebox system being used in our office environment. It allows a group of people to connect to a central, known service to control music playback.

The system consists of 3 components:
1. A centralised ExpressJS + socket.io *server* which fields all requests and serves the web client, found in `/server`.
2. A *web client* that is used by end users to see the current playlist and request new songs, found in`/web-client`.
3. A *music client* that is run on a system with mopidy installed that can connect to the *server* to fetch the playlist and play music.

The server and music client may be on the same machine.
