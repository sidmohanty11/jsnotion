import { RootState } from '..';
import { Action } from '../actions';

interface MiddlewareAPI<S, A> {
  getState(): S;
  dispatch(action: A): void;
}

interface _Middleware<S, A> {
  (api: MiddlewareAPI<S, A>): (
    next: (action: A) => void
  ) => (action: A) => void;
}

export type Middleware = _Middleware<RootState, Action>;
