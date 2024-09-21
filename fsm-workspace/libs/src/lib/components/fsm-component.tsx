import './fsm-component.css';
import { statesService } from '../data-access/states-service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StateId, StateItem, StatesResponse, States } from '../utils/types';
import { getNextStates } from '../utils/functions/get-next-states';

export const FsmComponent = () => {
  const isFetched = useRef(false);
  const [data, setData] = useState<States | undefined>(undefined);
  const [currentState, setCurrentState] = useState<StateId | undefined>(
    undefined
  );
  const [nextStates, setNextStates] = useState<StateItem[]>([]);

  const getData = useCallback(async () => {
    if (isFetched.current) return;
    isFetched.current = true;

    try {
      // TODO: turn on spinner
      const response: StatesResponse = await statesService.getStates();
      setData(response.items);
      setCurrentState(response.curr_state);
      const nextStatesList = getNextStates(response);
      if (nextStatesList && nextStatesList.length) {
        setNextStates(nextStatesList);
      }
    } catch (error) {
      console.log(error); // TODO: add error handling
    } finally {
      // TODO: turn off spinner
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="fsm-component-root">
      <div className="current-state">
        <h2>Current State</h2>
        {currentState && (
          <div className={`state-box state-${currentState}`}>
            {currentState}
          </div>
        )}
        {!currentState && <div>Current state is not available</div>}
      </div>
      <div className="next-states">
        <h3>Next Possible States</h3>
        <div className="states-list">
          {nextStates && nextStates.length > 0 ? (
            nextStates.map((item) =>
              item && item.id ? (
                <div key={item.id} className={`state-item state-${item.id}`}>
                  {item.label}
                </div>
              ) : null
            )
          ) : (
            <div>No next states available</div>
          )}
        </div>
      </div>
    </div>
  );
};
