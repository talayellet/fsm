import { StateId, StatesResponse, StateItem } from '../types';

export const getNextStates = (statesResponse: StatesResponse): StateItem[] => {
  const { items, curr_state } = statesResponse;

  const currentStateItem = items[curr_state];
  if (!currentStateItem) {
    throw new Error(`Current state ${curr_state} not found in items.`);
  }

  return currentStateItem.next.map(
    (nextStateId: StateId) => items[nextStateId]
  );
};
