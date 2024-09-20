import { Urls } from '../utils/constants';
import { StateResponse } from '../utils/types';

export const statesService = {
  //@ts-ignore
  getStates: async (): Promise<StateResponse | Error> => {
    const response = await fetch(Urls.STATES);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: StateResponse = await response.json();
    return data;
  },
};
