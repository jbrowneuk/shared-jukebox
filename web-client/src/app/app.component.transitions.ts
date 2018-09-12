import {
  transition,
  trigger,
  style,
  animate,
  keyframes
} from '@angular/animations';

const introTransition = '800ms ease-in';

const jukeboxLoadTransition = trigger('jukeboxLoadTransition', [
  transition(
    ':enter',
    animate(
      introTransition,
      keyframes([
        style({ opacity: 0, transform: 'scale(0.5)', offset: 0 }),
        style({ opacity: 1, transform: 'scale(1.0)', offset: 1 })
      ])
    )
  )
]);

const coverTransition = trigger('coverTransition', [
  transition(
    ':leave',
    animate(
      introTransition,
      keyframes([
        style({ transform: 'translateY(0%)', offset: 0 }),
        style({ transform: 'translateY(-100%)', offset: 1 })
      ])
    )
  )
]);

export const AppComponentTransitions = [jukeboxLoadTransition, coverTransition];
