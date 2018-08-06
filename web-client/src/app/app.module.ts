import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { JukeboxComponent } from './jukebox/jukebox.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { SocketService } from './socket.service';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { DurationPipe } from './duration.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    JukeboxComponent,
    PlaylistComponent,
    SearchComponent,
    NowPlayingComponent,
    DurationPipe
  ],
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
