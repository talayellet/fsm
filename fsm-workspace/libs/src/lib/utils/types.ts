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

export interface StateResponse {
  items: StateItem[];
  curr_state: StateId;
}
