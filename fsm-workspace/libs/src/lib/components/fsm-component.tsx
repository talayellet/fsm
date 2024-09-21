import './fsm-component.css';
import { statesService } from '../data-access/states-service';
import { useEffect, useRef, useState } from 'react';
import { StateItem, States } from '../utils/types';
import { getNextStates } from '../utils/functions/get-next-states';

export const FsmComponent = () => {
  const isFetched = useRef(false);
  const isFirstLoad = useRef(true);
  const [states, setStates] = useState<States | undefined>(undefined);
  const [currentState, setCurrentState] = useState<StateItem | undefined>(
    undefined
  );
  const [nextStates, setNextStates] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(false); // Loading for current state updates

  const getData = async () => {
    if (isFetched.current) return;
    isFetched.current = true;

    try {
      if (isFirstLoad.current) {
        setLoading(false);
      }

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

      isFirstLoad.current = false;
    } catch (error) {
      console.error('Error fetching data: ', error); // Handle errors
    } finally {
      isFetched.current = false;
    }
  };

  const handleStateClick = async (nextState: StateItem) => {
    try {
      setLoading(true);
      await statesService.updateCurrentState(nextState);

      setCurrentState(nextState);

      const nextStatesList = getNextStates({
        items: states!,
        currState: nextState,
      });
      setNextStates(nextStatesList);
    } catch (error) {
      console.error('Error updating state: ', error); // TODO: add error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderStateTree = (
    states: States,
    currentState: StateItem | undefined
  ) => {
    return (
      <ul className="state-tree">
        {Object.keys(states).map((stateKey) => {
          const key = stateKey as keyof States;
          const isActive = currentState?.id === states[key].id;
          return (
            <li key={key} className={isActive ? 'active-state' : ''}>
              {states[key].label}
              {states[key].next.length > 0 && (
                <ul>
                  {states[key].next.map((nextState) => {
                    return (
                      <li key={nextState}>
                        {states[nextState as keyof States].label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="fsm-component-root">
      {isFirstLoad.current ? (
        <div className="spinner-overlay">
          <h1>Loading...</h1>
          <div className="spinner" aria-label="Loading spinner"></div>
        </div>
      ) : (
        <>
          <div className="content-left">
            <div className="current-state">
              <h2>Current State</h2>
              {loading ? (
                <div className="current-state-spinner">
                  <div className="spinner" aria-label="Loading spinner"></div>
                </div>
              ) : currentState ? (
                <div className={`state-box state-${currentState.id}`}>
                  {currentState.label}
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
                        onClick={() => handleStateClick(item)}
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
          <div className="content-right">
            <h2>State Tree</h2>
            {states && renderStateTree(states, currentState)}
          </div>
        </>
      )}
    </div>
  );
};
