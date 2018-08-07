import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  it('should create an instance', () => {
    const pipe = new DurationPipe();
    expect(pipe).toBeTruthy();
  });

  it('should handle less than 1 second millisecond values', () => {
    const duration = 900; // .9 seconds

    const pipe = new DurationPipe();

    expect(pipe.transform(duration)).toBe('0:00');
  });

  it('should handle less than 1 minute millisecond values', () => {
    const duration = 10000; // 10 seconds

    const pipe = new DurationPipe();

    expect(pipe.transform(duration)).toBe('0:10');
  });

  it('should handle greater than 1 minute millisecond values', () => {
    const duration = 61000; // 61 seconds (1 min 1 second)

    const pipe = new DurationPipe();

    expect(pipe.transform(duration)).toBe('1:01');
  });

  it('should handle exactly 1 second millisecond value', () => {
    const duration = 1000;

    const pipe = new DurationPipe();

    expect(pipe.transform(duration)).toBe('0:01');
  });

  it('should handle exactly 1 minute millisecond value', () => {
    const duration = 60000;

    const pipe = new DurationPipe();

    expect(pipe.transform(duration)).toBe('1:00');
  });

  it('should handle negative millisecond value', () => {
    const duration = -60000;

    const pipe = new DurationPipe();

    expect(pipe.transform(duration)).toBe('');
  });

  it('should handle non-numeric values', () => {
    const values = ['any', {}];

    const pipe = new DurationPipe();

    values.forEach((value: any) => {
      expect(pipe.transform(value)).toBe('', `Failed on '${value}'`);
    });
  });
});
