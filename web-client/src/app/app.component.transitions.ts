import {
  transition,
  trigger,
  style,
  animate,
  keyframes,
  group
} from '@angular/animations';

const defaultTransition = 200;

const loginPageTransition = trigger('loginPageTransition', [
  transition(
    ':enter',
    animate(
      defaultTransition,
      keyframes([
        style({ opacity: 0, position: 'absolute', width: '100%', offset: 0 }),
        style({ opacity: 1, position: 'absolute', width: '100%', offset: 1 })
      ])
    )
  ),
  transition(
    ':leave',
    animate(
      defaultTransition,
      keyframes([
        style({ opacity: 1, position: 'absolute', width: '100%', offset: 0 }),
        style({ opacity: 0, position: 'absolute', width: '100%', offset: 1 })
      ])
    )
  )
]);

export const AnimationSettings = [loginPageTransition];
