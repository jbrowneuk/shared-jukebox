import {
  transition,
  trigger,
  style,
  animate,
  keyframes
} from '@angular/animations';
import { DefaultTransitions } from '../animation.settings';

const searchResultTransition = trigger('searchResultTransition', [
  transition(
    ':enter',
    animate(
      DefaultTransitions.easeOut,
      keyframes([
        style({ opacity: 0, height: 0, offset: 0 }),
        style({ opacity: 1, height: '*', offset: 1 })
      ])
    )
  ),
  transition(
    ':leave',
    animate(
      DefaultTransitions.easeIn,
      keyframes([
        style({ opacity: 1, height: '*', offset: 0 }),
        style({ opacity: 0, height: 0, offset: 1 })
      ])
    )
  )
]);

export const AnimationSettings = [searchResultTransition];
