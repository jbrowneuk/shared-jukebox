import {
  transition,
  trigger,
  style,
  animate,
  keyframes
} from '@angular/animations';
import { DefaultTransitions } from './animation.settings';

const loginPageTransition = trigger('loginPageTransition', [
  transition(
    ':enter',
    animate(
      DefaultTransitions.linear,
      keyframes([
        style({ opacity: 0, position: 'absolute', width: '100%', offset: 0 }),
        style({ opacity: 1, position: 'absolute', width: '100%', offset: 1 })
      ])
    )
  ),
  transition(
    ':leave',
    animate(
      DefaultTransitions.linear,
      keyframes([
        style({ opacity: 1, position: 'absolute', width: '100%', offset: 0 }),
        style({ opacity: 0, position: 'absolute', width: '100%', offset: 1 })
      ])
    )
  )
]);

export const AnimationSettings = [loginPageTransition];
