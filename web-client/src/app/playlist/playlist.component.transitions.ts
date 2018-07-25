import {
  transition,
  trigger,
  style,
  animate,
  keyframes
} from '@angular/animations';
import { DefaultTransitions } from '../animation.settings';

const helpTransition = trigger('helpTransition', [
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

const itemTransition = trigger('itemTransition', [
  transition(
    ':enter',
    animate(
      DefaultTransitions.easeOut,
      keyframes([
        style({ opacity: 0, height: 0, transform: 'translateX(-50%)', offset: 0 }),
        style({ opacity: 1, height: '*', transform: 'none', offset: 1 })
      ])
    )
  ),
  transition(
    ':leave',
    animate(
      DefaultTransitions.easeIn,
      keyframes([
        style({ opacity: 1, height: '*', transform: 'none', offset: 0 }),
        style({ opacity: 0, height: 0, transform: 'translateX(50%)', offset: 1 })
      ])
    )
  )
]);

export const AnimationSettings = [itemTransition, helpTransition];
