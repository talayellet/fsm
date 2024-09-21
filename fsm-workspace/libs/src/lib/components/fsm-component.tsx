import './fsm-component.css';
import { statesService } from '../data-access/states-service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StateId, StateItem, States } from '../utils/types';
import { getNextStates } from '../utils/functions/get-next-states';

export const FsmComponent = () => {
  const isFetched = useRef(false);
  const [states, setStates] = useState<States | undefined>(undefined);
  const [currentState, setCurrentState] = useState<StateId | undefined>(
    undefined
  );
  const [nextStates, setNextStates] = useState<StateItem[]>([]);

  const getData = useCallback(async () => {
    if (isFetched.current) return;
    isFetched.current = true;

    try {
      const statesData = await statesService.getStates();
      const currState = await statesService.getCurrentState();

      setStates(statesData);
      setCurrentState(currState);

      const nextStatesList = getNextStates({
        items: statesData,
        currState: currState,
      });
      if (nextStatesList && nextStatesList.length) {
        setNextStates(nextStatesList);
      }
    } catch (error) {
      console.log(error); // TODO: add error handling
    } finally {
      isFetched.current = false;
      // TODO: Add spinner
    }
  }, []);

  const handleStateClick = async (nextStateId: StateId) => {
    try {
      await statesService.updateCurrentState(nextStateId);
      isFetched.current = false;
      await getData();
    } catch (error) {
      console.log(error); // TODO: add error handling
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="fsm-component-root">
      <div className="current-state">
        <h2>Current State</h2>
        {currentState ? (
          <div className={`state-box state-${currentState}`}>
            {currentState}
          </div>
        ) : (
          <div>Current state is not available</div>
        )}
      </div>
      <div className="next-states">
        <h3>Next Possible States</h3>
        <div className="states-list">
          {nextStates && nextStates.length > 0 ? (
            nextStates.map((item) =>
              item && item.id ? (
                <div
                  key={item.id}
                  className={`state-item state-${item.id}`}
                  onClick={() => handleStateClick(item.id)}
                >
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
