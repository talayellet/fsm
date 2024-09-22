import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { statesService } from './states-service';
import { Urls } from '../utils/constants';
import {
  ERROR_CODE_1,
  ERROR_CODE_2,
  ERROR_TEXT_1,
  ERROR_TEXT_2,
  IDLE_STATE,
  SUCCESS_STATE,
  MOCK_STATES,
  SUCCESS_CODE_1,
  LOADING_STATE,
} from '../utils/mocks';

enableFetchMocks();

describe('statesService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('getStates', () => {
    it('should fetch states and return the data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(MOCK_STATES));
      const result = await statesService.getStates();
      expect(result).toEqual(MOCK_STATES);
      expect(fetchMock).toHaveBeenCalledWith(Urls.STATES);
    });

    it('should throw an error if the fetch fails', async () => {
      fetchMock.mockResponseOnce('', {
        status: ERROR_CODE_1,
        statusText: ERROR_TEXT_1,
      });

      await expect(statesService.getStates()).rejects.toThrow(
        `Error ${ERROR_CODE_1}: ${ERROR_TEXT_1}`
      );
    });
  });

  describe('getCurrentState', () => {
    it('should fetch the current state and return the data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ curr_state: IDLE_STATE }));

      const result = await statesService.getCurrentState();
      expect(result).toEqual(IDLE_STATE);
      expect(fetchMock).toHaveBeenCalledWith(Urls.CURRENT_STATE);
    });

    it('should throw an error if the fetch fails', async () => {
      fetchMock.mockResponseOnce('', {
        status: ERROR_CODE_2,
        statusText: ERROR_TEXT_2,
      });

      await expect(statesService.getCurrentState()).rejects.toThrow(
        `Error ${ERROR_CODE_2}: ${ERROR_TEXT_2}`
      );
    });
  });

  describe('updateCurrentState', () => {
    it('should update the current state if the next state is valid', async () => {
      fetchMock.mockResponses(
        [
          JSON.stringify({ curr_state: LOADING_STATE }),
          { status: SUCCESS_CODE_1 },
        ],
        ['', { status: SUCCESS_CODE_1 }]
      );

      await statesService.updateCurrentState(SUCCESS_STATE);

      expect(fetchMock).toHaveBeenCalledWith(Urls.CURRENT_STATE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ curr_state: SUCCESS_STATE }),
      });
    });

    it('should throw an error if the next state is not valid', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ curr_state: IDLE_STATE }));

      await expect(
        statesService.updateCurrentState(IDLE_STATE)
      ).rejects.toThrow(
        `The ${IDLE_STATE.id} state is not a valid next state from the current state (${IDLE_STATE.id})`
      );
    });

    it('should throw an error if the PUT request fails', async () => {
      fetchMock.mockResponses(
        [
          JSON.stringify({ curr_state: LOADING_STATE }),
          { status: SUCCESS_CODE_1 },
        ],
        ['', { status: ERROR_CODE_2, statusText: ERROR_TEXT_2 }]
      );

      await expect(
        statesService.updateCurrentState(SUCCESS_STATE)
      ).rejects.toThrow(
        `Failed to update current state: ${ERROR_CODE_2} - ${ERROR_TEXT_2}`
      );
    });
  });
});
