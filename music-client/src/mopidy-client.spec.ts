import { MopidyClient } from './mopidy-client';
import { Mock, IMock, It, Times } from 'typemoq';
import { EventEmitter } from 'events';

describe('Mopidy Client', () => {
  let mockMopidy: IMock<EventEmitter>;
  const mockMopidyFactory = () => mockMopidy.object;

  beforeEach(() => {
    mockMopidy = Mock.ofType<EventEmitter>();
  });

  it('should construct', () => {
    const client = new MopidyClient('any-url', mockMopidyFactory);
    expect(client).toBeTruthy();
  });

  it('should subscribe to mopidy online and offline states when initialised', () => {
    const client = new MopidyClient('any-url', mockMopidyFactory);
    client.initialize();

    mockMopidy.verify(m => m.on('state:online', It.isAny()), Times.once());
    mockMopidy.verify(m => m.on('state:offline', It.isAny()), Times.once());
  });
});
