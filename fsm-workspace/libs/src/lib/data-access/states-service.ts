import { Urls } from '../utils/constants';
import { StateId, States } from '../utils/types';

export const statesService = {
  getStates: async (): Promise<States> => {
    const response = await fetch(Urls.STATES);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const states: States = await response.json();
    return states;
  },

  getCurrentState: async (): Promise<StateId> => {
    const response = await fetch(Urls.CURRENT_STATE);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: { curr_state: StateId } = await response.json();
    return data.curr_state;
  },

  updateCurrentState: async (nextStateId: StateId): Promise<void> => {
    const currentStateResponse = await fetch(Urls.CURRENT_STATE);
    const currentStateData = await currentStateResponse.json();
    currentStateData.curr_state = nextStateId;

    const response = await fetch(Urls.CURRENT_STATE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentStateData),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update current state: ${response.status} - ${response.statusText}`
      );
    }
  },
};
