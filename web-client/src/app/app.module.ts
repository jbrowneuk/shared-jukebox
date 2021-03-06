import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { JukeboxComponent } from './jukebox/jukebox.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { ControlsComponent } from './controls/controls.component';
import { SocketService } from './socket.service';
import { PlaylistService } from './playlist.service';
import { BrowserTitleService } from './browser-title.service';
import { DurationPipe } from './duration.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    JukeboxComponent,
    PlaylistComponent,
    SearchComponent,
    ControlsComponent,
    DurationPipe
  ],
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule],
  providers: [SocketService, PlaylistService, BrowserTitleService],
  bootstrap: [AppComponent]
})
export class AppModule {}
