import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IdentityComponent } from './identity/identity.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { JukeboxComponent } from './jukebox/jukebox.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { SocketService } from './socket.service';

@NgModule({
  declarations: [
    AppComponent,
    IdentityComponent,
    SpinnerComponent,
    JukeboxComponent,
    PlaylistComponent,
    SearchComponent
  ],
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
