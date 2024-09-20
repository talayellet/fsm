import './fsm-component.css';
import { statesService } from '../data-access/states-service';
import { useEffect, useRef } from 'react';

export const FsmComponent = () => {
  const isFetched = useRef(false);

  useEffect(() => {
    if (!isFetched.current) {
      try {
        statesService.getStates().then((statesResponse) => {
          console.log('statesResponse:', statesResponse);
        });
      } catch (error) {
        console.log(error);
      } finally {
        isFetched.current = true;
      }
    }
  }, []);

  return <div>AAA</div>;
};
