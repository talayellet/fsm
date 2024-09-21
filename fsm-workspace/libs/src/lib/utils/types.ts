export enum StateId {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum StateLabel {
  IDLE = 'Idle',
  LOADING = 'Loading',
  SUCCESS = 'Success',
  ERROR = 'Error',
}

export interface StateItem {
  id: StateId;
  label: StateLabel;
  next: StateId[];
  prev?: StateId[];
}

export interface States {
  idle: StateItem;
  loading: StateItem;
  success: StateItem;
  error: StateItem;
}

export interface StatesResponse {
  items: States;
  curr_state: StateId;
}
