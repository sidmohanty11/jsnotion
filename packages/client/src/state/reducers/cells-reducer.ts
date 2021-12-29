import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState['data']);
        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        return state;
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);
        return state;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx > state.order.length - 1) {
          return state;
        }
        state.order[index] = state.order[targetIdx];
        state.order[targetIdx] = action.payload.id;
        return state;
      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          content: '',
          type: action.payload.type,
          id: randomId(),
        };
        state.data[cell.id] = cell;
        const idx = state.order.findIndex((id) => id === action.payload.id);
        if (idx < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(idx + 1, 0, cell.id);
        }
        return state;
      default:
        return state;
    }
  }
);

const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

export default reducer;
