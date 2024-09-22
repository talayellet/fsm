import { StateId, StateItem, StateLabel, States } from './types';

export const LOADING_STATE: StateItem = {
  id: StateId.LOADING,
  label: StateLabel.LOADING,
  next: [StateId.SUCCESS, StateId.ERROR],
};

export const SUCCESS_STATE: StateItem = {
  id: StateId.SUCCESS,
  label: StateLabel.SUCCESS,
  next: [StateId.IDLE],
};

export const IDLE_STATE: StateItem = {
  id: StateId.IDLE,
  label: StateLabel.IDLE,
  next: [StateId.LOADING],
};

export const MOCK_STATES: States = {
  idle: IDLE_STATE,
  loading: LOADING_STATE,
  success: SUCCESS_STATE,
  error: { id: StateId.ERROR, label: StateLabel.ERROR, next: [] },
};

export const SUCCESS_CODE_1 = 200;
export const ERROR_CODE_1 = 404;
export const ERROR_CODE_2 = 500;
export const ERROR_TEXT_1 = 'Not Found';
export const ERROR_TEXT_2 = 'Internal Server Error';
export const UPDATE_STATE_ERROR = 'update state error';
export const NETWORK_ERROR = 'Network Error';

export const LOADING_REG = new RegExp(/loading/i);
export const IDLE_REG = new RegExp(/idle/i);
export const FETCH_ERR_REG = new RegExp(/failed to load data/i);
export const STATE_ERR_REG = new RegExp(/failed to update state/i);
