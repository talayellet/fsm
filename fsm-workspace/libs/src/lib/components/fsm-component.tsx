import './fsm-component.css';
import { statesService } from '../data-access/states-service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StateId, StateItem, StatesResponse, States } from '../utils/types';
import { DEFAULT_NEXT_STATES } from '../utils/constants';
import { getNextStates } from '../utils/functions/get-next-states';

export const FsmComponent = () => {
  const isFetched = useRef(false);
  const [data, setData] = useState<States | undefined>(undefined);
  const [currentState, setCurrentState] = useState<StateId>(StateId.IDLE);
  const [nextStates, setNextStates] =
    useState<StateItem[]>(DEFAULT_NEXT_STATES);

  const getData = useCallback(async () => {
    if (!isFetched.current) {
      try {
        const response: StatesResponse = await statesService.getStates();
        setData(response.items);
        setCurrentState(response.curr_state);
        setNextStates(getNextStates(response));
      } catch (error) {
        console.log(error); // TODO: add error handling
      } finally {
        isFetched.current = true; // TODO: add loading
      }
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="fsm-component-root">
      <div className="current-state">Current State: {currentState}</div>
      <div className="next-states">
        Next States:
        {nextStates.map((item) => (
          <div key={item.id}>{item.label}</div>
        ))}
      </div>
    </div>
  );
};
