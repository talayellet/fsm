import { StateId, StateItem, States } from '../types';

interface GetNextStatesProps {
  items: States;
  currState: StateId;
}

export const getNextStates = (props: GetNextStatesProps): StateItem[] => {
  const { items, currState } = props;
  const currentStateItem = items[currState];
  if (!currentStateItem) {
    throw new Error(`Current state ${currState} not found in items.`);
  }

  const nextStates = currentStateItem.next.map((nextStateId: StateId) => {
    const nextStateItem = items[nextStateId];
    if (!nextStateItem) {
      throw new Error(`Next state ${nextStateId} not found in items.`);
    }
    return nextStateItem;
  });

  return nextStates;
};
