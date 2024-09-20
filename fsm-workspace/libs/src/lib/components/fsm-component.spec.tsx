import { render } from '@testing-library/react';

import FsmComponent from './fsm-component';

describe('FsmComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FsmComponent />);
    expect(baseElement).toBeTruthy();
  });
});
