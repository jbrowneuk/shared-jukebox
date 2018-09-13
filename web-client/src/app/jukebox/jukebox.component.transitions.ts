import {
  transition,
  trigger,
  style,
  animate,
  keyframes
} from '@angular/animations';
import { DefaultTransitions } from '../animation.settings';

const searchContainerTransition = trigger('searchContainerTransition', [
  transition(
    ':enter',
    animate(
      DefaultTransitions.easeOut,
      keyframes([
        style({ opacity: 0, transform: 'translateX(10%)', offset: 0 }),
        style({ opacity: 1, transform: 'none', offset: 1 })
      ])
    )
  ),
  transition(
    ':leave',
    animate(
      DefaultTransitions.easeIn,
      keyframes([
        style({ opacity: 1, transform: 'none', offset: 0 }),
        style({ opacity: 0, transform: 'translateX(10%)', offset: 1 })
      ])
    )
  )
]);

const searchModeTransition = trigger('searchModeTransition', [
  transition(
    'false => true',
    animate(
      DefaultTransitions.easeOut,
      keyframes([
        style({ opacity: 1, transform: 'none', offset: 0 }),
        style({ opacity: 0, transform: 'translateX(-10%)', offset: 1 })
      ])
    )
  ),
  transition(
    'true => false',
    animate(
      DefaultTransitions.easeIn,
      keyframes([
        style({ opacity: 0, transform: 'translateX(-10%)', offset: 0 }),
        style({ opacity: 1, transform: 'none', offset: 1 })
      ])
    )
  )
]);

export const JukeboxAnimationSettings = [searchContainerTransition, searchModeTransition];
