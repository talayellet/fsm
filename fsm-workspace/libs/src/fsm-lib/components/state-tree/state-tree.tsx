import { StateItem, States } from '../../utils/types';

export interface StateTreeProps {
  states: States;
  currentState: StateItem;
}
export const StateTree = ({ states, currentState }: StateTreeProps) => (
  <ul className="state-tree">
    {Object.keys(states).map((stateKey) => {
      const key = stateKey as keyof States;
      const isActive = currentState?.id === states[key].id;
      return (
        <li key={key} className={isActive ? 'active-state' : ''}>
          {states[key].label}
          {states[key].next.length > 0 && (
            <ul>
              {states[key].next.map((nextState) => (
                <li key={nextState}>
                  {states[nextState as keyof States].label}
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    })}
  </ul>
);
