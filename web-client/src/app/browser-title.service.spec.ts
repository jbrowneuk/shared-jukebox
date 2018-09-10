import { Title } from '@angular/platform-browser';
import { It, IMock, Mock, Times } from 'typemoq';

import { BrowserTitleService } from './browser-title.service';


const titleStem = 'Jukebot';

describe('Title Service wrapper', () => {
  let mockTitle: IMock<Title>;

  beforeEach(() => {
    mockTitle = Mock.ofType<Title>();
  });

  it ('should set and format title if non-empty string is passed', () => {
    const newTitle = 'my new title';
    const expectedTitle = `${titleStem}: ${newTitle}`;
    mockTitle.setup(s => s.setTitle(It.isAnyString()));

    const service = new BrowserTitleService(mockTitle.object);

    service.setTitle(newTitle);

    mockTitle.verify(s => s.setTitle(It.isValue(expectedTitle)), Times.once());
  });

  it ('should set default title if empty string is passed', () => {
    const newTitle = '';
    const expectedTitle = titleStem;
    mockTitle.setup(s => s.setTitle(It.isAnyString()));

    const service = new BrowserTitleService(mockTitle.object);

    service.setTitle(newTitle);

    mockTitle.verify(s => s.setTitle(It.isValue(expectedTitle)), Times.once());
  });

  it ('should set default title if reset is called', () => {
    const expectedTitle = titleStem;
    mockTitle.setup(s => s.setTitle(It.isAnyString()));

    const service = new BrowserTitleService(mockTitle.object);

    service.resetTitle();

    mockTitle.verify(s => s.setTitle(It.isValue(expectedTitle)), Times.once());
  });
});
