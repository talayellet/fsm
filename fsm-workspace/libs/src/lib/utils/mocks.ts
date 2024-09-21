import { StateId, StateItem, StateLabel, States } from './types';

export const MOCK_STATES: States = {
  idle: {
    id: StateId.IDLE,
    label: StateLabel.IDLE,
    next: [StateId.LOADING],
  },
  loading: {
    id: StateId.LOADING,
    label: StateLabel.LOADING,
    next: [StateId.SUCCESS, StateId.ERROR],
  },
  success: { id: StateId.SUCCESS, label: StateLabel.SUCCESS, next: [] },
  error: { id: StateId.ERROR, label: StateLabel.ERROR, next: [] },
};

export const SUCCESS_CODE_1 = 200;
export const ERROR_CODE_1 = 404;
export const ERROR_CODE_2 = 500;
export const ERROR_TEXT_1 = 'Not Found';
export const ERROR_TEXT_2 = 'Internal Server Error';

export const MOCK_CURRENT_STATE_1: StateItem = {
  id: StateId.LOADING,
  label: StateLabel.LOADING,
  next: [StateId.SUCCESS, StateId.ERROR],
};

export const MOCK_CURRENT_STATE_2: StateItem = {
  id: StateId.SUCCESS,
  label: StateLabel.SUCCESS,
  next: [],
};

export const MOCK_CURRENT_STATE_3: StateItem = {
  id: StateId.IDLE,
  label: StateLabel.IDLE,
  next: [],
};
