import {
  transition,
  trigger,
  style,
  animate,
  keyframes
} from '@angular/animations';
import { DefaultTransitions } from '../animation.settings';

const playPauseTransition = trigger('playPauseTransition', [
  transition(
    ':enter',
    animate(
      DefaultTransitions.easeOut,
      keyframes([
        style({ opacity: 0, offset: 0 }),
        style({ opacity: 1, offset: 1 })
      ])
    )
  ),
  transition(
    ':leave',
    animate(
      DefaultTransitions.easeIn,
      keyframes([
        style({ opacity: 1, offset: 0 }),
        style({ opacity: 0, offset: 1 })
      ])
    )
  )
]);

export const AnimationSettings = [playPauseTransition];
