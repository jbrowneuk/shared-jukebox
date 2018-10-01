import { MopidyClient } from './mopidy-client';

describe('Mopidy Client', () => {
  it('should construct', () => {
    const client = new MopidyClient('any-url');
    expect(client).toBeTruthy();
  });
});
