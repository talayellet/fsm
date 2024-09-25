import { useMemo } from 'react';
import { useFsmStates } from '../../hooks/use-fsm-states';
import { StateTree } from '../state-tree/state-tree';
import './fsm.css';

export const FsmComponent = () => {
  const {
    states,
    currentState,
    nextStates,
    pageLoading,
    contentLoading,
    error,
    setError,
    getData,
    updateState,
  } = useFsmStates();

  const dismissError = () => {
    setError(null);
    getData();
  };

  console.log('Content loading state:', contentLoading);

  const renderedNextStates = useMemo(() => {
    return nextStates.map((item) =>
      item && item.id ? (
        <div
          key={item.id}
          className={`state-item state-${item.id}`}
          onClick={() => updateState(item)}
          role="button"
          aria-label={`Next state: ${item.label}`}
          tabIndex={0}
        >
          {item.label}
        </div>
      ) : null
    );
  }, [nextStates, updateState]);

  return (
    <div className="fsm-component-root">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="close-btn" onClick={dismissError}>
            &times;
          </button>
        </div>
      )}

      {pageLoading ? (
        <div className="spinner-overlay">
          <h1>Loading...</h1>
          <div className="spinner" aria-label="Loading spinner"></div>
        </div>
      ) : (
        <>
          <div className="content-left">
            {contentLoading ? (
              <div className="current-state-spinner">
                <div className="spinner" aria-label="Loading spinner"></div>
              </div>
            ) : (
              <>
                <div className="current-state">
                  <h2>Current State</h2>
                  {currentState ? (
                    <div className={`state-box state-${currentState.id}`}>
                      {currentState.label}
                    </div>
                  ) : (
                    <div>
                      No current state available. Please select a state.
                    </div>
                  )}
                </div>

                <div className="next-states">
                  <h3>Next Possible States</h3>
                  <div className="states-list">
                    {nextStates && nextStates.length > 0 ? (
                      renderedNextStates
                    ) : (
                      <div>No next states available</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="content-right">
            <h2>State Tree</h2>
            {states && currentState ? (
              <StateTree states={states} currentState={currentState} />
            ) : (
              <p>No state tree available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
