import {
  transition,
  trigger,
  style,
  animate,
  keyframes,
  group
} from '@angular/animations';

const defaultTransition = '200ms ease-in';

const helpTransition = trigger('helpTransition', [
  transition(
    ':enter',
    animate(
      defaultTransition,
      keyframes([
        style({ opacity: 0, height: 0, offset: 0 }),
        style({ opacity: 1, height: '*', offset: 1 })
      ])
    )
  ),
  transition(
    ':leave',
    animate(
      defaultTransition,
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
      defaultTransition,
      keyframes([
        style({ opacity: 0, height: 0, transform: 'translateX(-50%)', offset: 0 }),
        style({ opacity: 1, height: '*', transform: 'none', offset: 1 })
      ])
    )
  ),
  transition(
    ':leave',
    animate(
      defaultTransition,
      keyframes([
        style({ opacity: 1, height: '*', transform: 'none', offset: 0 }),
        style({ opacity: 0, height: 0, transform: 'translateX(50%)', offset: 1 })
      ])
    )
  )
]);

export const AnimationSettings = [itemTransition, helpTransition];
