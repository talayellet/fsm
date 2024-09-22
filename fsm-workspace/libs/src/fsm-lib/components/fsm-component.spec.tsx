import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FsmComponent } from './fsm-component';
import { statesService } from '../data-access/states-service';
import '@testing-library/jest-dom';
import {
  FETCH_ERR_REG,
  IDLE_REG,
  IDLE_STATE,
  LOADING_REG,
  MOCK_STATES,
  NETWORK_ERROR,
  STATE_ERR_REG,
  SUCCESS_STATE,
  UPDATE_STATE_ERROR,
} from '../utils/mocks';
import userEvent from '@testing-library/user-event';
import { StateLabel } from '../utils/types';

jest.mock('../data-access/states-service');

describe('FsmComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render current state and next states after loading', async () => {
    (statesService.getStates as jest.Mock).mockResolvedValue(MOCK_STATES);
    (statesService.getCurrentState as jest.Mock).mockResolvedValue(IDLE_STATE);

    render(<FsmComponent />);

    const idle = await screen.findAllByText(IDLE_REG);
    expect(idle[0]).toBeInTheDocument();

    const loading = await screen.findAllByText(LOADING_REG);
    expect(loading[0]).toBeInTheDocument();
  });

  it('should update current state and next states on state click', async () => {
    (statesService.getStates as jest.Mock).mockResolvedValue(MOCK_STATES);
    (statesService.getCurrentState as jest.Mock).mockResolvedValue(IDLE_STATE);
    (statesService.updateCurrentState as jest.Mock).mockResolvedValueOnce(
      SUCCESS_STATE
    );

    render(<FsmComponent />);
    const loadingItems = await screen.findAllByText(StateLabel.LOADING);
    userEvent.click(loadingItems[0]);

    await waitFor(() => {
      const successState = screen.getByText(StateLabel.SUCCESS, {
        selector: '.state-item.state-success',
      });
      expect(successState).toBeInTheDocument();
      userEvent.click(successState);
    });

    await waitFor(() => {
      const idleState = screen.getByText('Idle', {
        selector: '.state-item.state-idle',
      });
      expect(idleState).toBeInTheDocument();
    });
  });

  it('should handle errors when fetching data fails', async () => {
    (statesService.getStates as jest.Mock).mockRejectedValue(
      new Error(NETWORK_ERROR)
    );
    (statesService.getCurrentState as jest.Mock).mockRejectedValue(
      new Error(NETWORK_ERROR)
    );

    render(<FsmComponent />);

    await waitFor(() => {
      expect(screen.getByText(FETCH_ERR_REG)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/×/));

    expect(screen.queryByText(FETCH_ERR_REG)).not.toBeInTheDocument();
  });

  it('should handle errors when updating state fails', async () => {
    (statesService.getStates as jest.Mock).mockResolvedValue(MOCK_STATES);
    (statesService.getCurrentState as jest.Mock).mockResolvedValue(IDLE_STATE);
    (statesService.updateCurrentState as jest.Mock).mockRejectedValue(
      new Error(UPDATE_STATE_ERROR)
    );

    render(<FsmComponent />);

    const idle = await screen.findAllByText(IDLE_REG);
    expect(idle[0]).toBeInTheDocument();

    const loadingItems = await screen.findAllByText(StateLabel.LOADING);
    userEvent.click(loadingItems[0]);

    await waitFor(() => {
      expect(screen.getByText(STATE_ERR_REG)).toBeInTheDocument();
    });
  });

  it('should render state tree correctly', async () => {
    (statesService.getStates as jest.Mock).mockResolvedValue(MOCK_STATES);
    (statesService.getCurrentState as jest.Mock).mockResolvedValue(IDLE_STATE);

    render(<FsmComponent />);

    await screen.findAllByText(IDLE_REG);

    const loadingElements = screen.getAllByText(StateLabel.LOADING);
    const successElements = screen.getAllByText(StateLabel.SUCCESS);
    const errorElements = screen.getAllByText(StateLabel.ERROR);

    expect(loadingElements.length).toBe(3);
    expect(successElements.length).toBe(2);
    expect(errorElements.length).toBe(2);
  });
});
