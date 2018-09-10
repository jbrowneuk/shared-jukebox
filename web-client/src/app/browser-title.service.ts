import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

const siteTitle = 'Jukebot';

@Injectable({
  providedIn: 'root'
})
export class BrowserTitleService {

  constructor(private titleService: Title) {}

  public resetTitle(): void {
    this.setTitle('');
  }

  public setTitle(title: string): void {
    let titleSuffix = '';
    if (title && title.length > 0) {
      titleSuffix = `: ${title}`;
    }

    this.titleService.setTitle(`${siteTitle}${titleSuffix}`);
  }
}
