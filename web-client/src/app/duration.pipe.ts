import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(durationMs: number): string {
    if (!durationMs || typeof durationMs !== 'number' || durationMs < 0) {
      return '';
    }

    // This doesn't handle > 1hr durations
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);

    return minutes + ':' + this.addLeadingZero(seconds);
  }

  private addLeadingZero(value: number): string {
    const leading = value < 10 ? '0' : '';
    return `${leading}${value}`;
  }

}
