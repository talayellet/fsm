import { StateId, StateItem, StateLabel } from './types';

export enum Urls {
  STATES = 'http://localhost:3000/states',
}

export const DEFAULT_STATE: StateItem = {
  id: StateId.IDLE,
  label: StateLabel.IDLE,
  next: [StateId.LOADING],
};

export const DEFAULT_NEXT_STATES: StateItem[] = [
  {
    id: StateId.LOADING,
    label: StateLabel.LOADING,
    next: [StateId.SUCCESS, StateId.ERROR],
  },
];
