import { MopidyClient } from './mopidy-client';
import { Mock, IMock } from 'typemoq';
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
});
