import { getNextStates } from './get-next-states';
import {
  MOCK_STATES,
  LOADING_STATE,
  SUCCESS_STATE,
  INVALID_STATE,
  INVALID_STATE_ID,
} from '../mocks';
import { StateId, StateItem, StateLabel } from '../types';

describe('getNextStates', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should return the next states for a given current state', () => {
    const result = getNextStates({
      items: MOCK_STATES,
      currState: LOADING_STATE,
    });
    expect(result).toEqual([SUCCESS_STATE, MOCK_STATES.error]);
  });

  it('should throw an error if the current state is not found in items', () => {
    expect(() =>
      getNextStates({
        items: MOCK_STATES,
        currState: INVALID_STATE as StateItem,
      })
    ).toThrow(`Current state ${INVALID_STATE.id} not found in items.`);
  });

  it('should throw an error if any of the next states is not found in items', () => {
    expect(() =>
      getNextStates({
        items: MOCK_STATES,
        currState: {
          id: StateId.SUCCESS,
          label: StateLabel.SUCCESS,
          next: [INVALID_STATE_ID as StateId],
        },
      })
    ).toThrow(`Next state ${INVALID_STATE_ID} not found in items.`);
  });

  it('should return an empty array if the current state has no next states', () => {
    const result = getNextStates({
      items: MOCK_STATES,
      currState: {
        id: StateId.SUCCESS,
        label: StateLabel.SUCCESS,
        next: [],
      },
    });
    expect(result).toEqual([]);
  });

  it('should handle multiple next states correctly', () => {
    const result = getNextStates({
      items: MOCK_STATES,
      currState: LOADING_STATE,
    });
    expect(result).toEqual([MOCK_STATES.success, MOCK_STATES.error]);
  });
});
