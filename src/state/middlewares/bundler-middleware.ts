import { Middleware } from './middleware';
import { ActionType } from '../action-types';
import bundler from '../../bundler';

let timer: any;

export const bundlerMiddleware: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    next(action);

    // check if action type is other than update
    if (action.type !== ActionType.UPDATE_CELL) {
      return;
    }

    // check if action gets triggered to a text cell
    const { cells } = getState();
    const cell = cells!.data[action.payload.id];
    if (cell.type === 'text') {
      return;
    }

    clearTimeout(timer);
    setTimeout(async () => {
      const res = await bundler(action.payload.content);
      if (res) {
        dispatch({
          type: ActionType.BUNDLE_CREATED,
          payload: { bundle: res, cellId: action.payload.id },
        });
      }
    }, 1000);
  };
