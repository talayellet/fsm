import { useCallback, useEffect, useRef, useState } from 'react';
import { StateItem, States } from '../utils/types';
import { statesService } from '../data-access/states-service';
import { getNextStates } from '../utils/functions/get-next-states';

export const useFsmStates = () => {
  const [states, setStates] = useState<States | undefined>(undefined);
  const [currentState, setCurrentState] = useState<StateItem | undefined>(
    undefined
  );
  const [nextStates, setNextStates] = useState<StateItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true); // For initial page load
  const [contentLoading, setContentLoading] = useState(false); // For state updates
  const [error, setError] = useState<string | null>(null);

  // Ref to prevent fetching data multiple times
  const isFetched = useRef(false);

  const getData = useCallback(async () => {
    if (isFetched.current) return;
    isFetched.current = true;

    setPageLoading(true);
    try {
      const statesData = await statesService.getStates();
      const currState = await statesService.getCurrentState();
      setStates(statesData);
      setCurrentState(currState);
      setNextStates(getNextStates({ items: statesData, currState }));
    } catch (error) {
      setError(`Failed to load data. Reason: ${error}`);
    } finally {
      setPageLoading(false);
    }
  }, []);

  const updateState = useCallback(
    async (nextState: StateItem) => {
      // Force a microtask delay to allow React to re-render the content spinner
      requestAnimationFrame(() => setContentLoading(true)); // Spinner should trigger immediately after this

      try {
        await statesService.updateCurrentState(nextState);

        console.log('Updating current state to:', nextState);
        setCurrentState(nextState);

        // Update the list of next possible states
        const nextStatesList = getNextStates({
          items: (states as States) ?? [],
          currState: nextState,
        });
        setNextStates(nextStatesList);
      } catch (error) {
        setError(`Failed to update state. Please try again. Reason: ${error}`);
      } finally {
        setContentLoading(false); // Stop the spinner
      }
    },
    [states]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  return {
    states,
    currentState,
    nextStates,
    pageLoading,
    contentLoading,
    error,
    setError,
    getData,
    updateState,
  };
};
