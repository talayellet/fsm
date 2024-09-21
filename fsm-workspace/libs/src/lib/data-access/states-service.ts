import { Urls } from '../utils/constants';
import { StatesResponse } from '../utils/types';

export const statesService = {
  getStates: async (): Promise<StatesResponse> => {
    const response = await fetch(Urls.STATES);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: StatesResponse = await response.json();
    return data;
  },
};
