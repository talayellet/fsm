import { render, screen, fireEvent } from '@testing-library/react';
import { FsmComponent } from './fsm';
import { useFsmStates } from '../../hooks/use-fsm-states';
import { StateId, StateLabel, StateItem } from '../../utils/types';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock the useFsmStates hook
jest.mock('../../hooks/use-fsm-states');

describe('FsmComponent', () => {
  let mockUseFsmStates: jest.MockedFunction<typeof useFsmStates>;

  const mockStates = {
    idle: { id: StateId.IDLE, label: StateLabel.IDLE, next: [StateId.LOADING] },
    loading: {
      id: StateId.LOADING,
      label: StateLabel.LOADING,
      next: [StateId.SUCCESS, StateId.ERROR],
    },
    success: { id: StateId.SUCCESS, label: StateLabel.SUCCESS, next: [] },
    error: { id: StateId.ERROR, label: StateLabel.ERROR, next: [] },
  };

  const mockCurrentState: StateItem = mockStates.idle;
  const mockNextStates: StateItem[] = [mockStates.loading];

  beforeEach(() => {
    mockUseFsmStates = useFsmStates as jest.MockedFunction<typeof useFsmStates>;
  });

  it('should show loading spinner when pageLoading is true', () => {
    // Arrange
    mockUseFsmStates.mockReturnValue({
      states: mockStates,
      currentState: undefined,
      nextStates: [],
      pageLoading: true,
      contentLoading: false,
      error: null,
      setError: jest.fn(),
      getData: jest.fn(),
      updateState: jest.fn(),
    });

    // Act
    render(<FsmComponent />);

    // Assert
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loading spinner/i)).toBeInTheDocument();
  });

  it('should display error banner when there is an error', () => {
    // Arrange
    const errorMessage = 'An error occurred!';
    mockUseFsmStates.mockReturnValue({
      states: mockStates,
      currentState: undefined,
      nextStates: [],
      pageLoading: false,
      contentLoading: false,
      error: errorMessage,
      setError: jest.fn(),
      getData: jest.fn(),
      updateState: jest.fn(),
    });

    // Act
    render(<FsmComponent />);

    // Assert
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /×/i })).toBeInTheDocument();
  });

  it('should dismiss error and call getData when close button is clicked', () => {
    // Arrange
    const mockSetError = jest.fn();
    const mockGetData = jest.fn();
    mockUseFsmStates.mockReturnValue({
      states: mockStates,
      currentState: undefined,
      nextStates: [],
      pageLoading: false,
      contentLoading: false,
      error: 'An error occurred!',
      setError: mockSetError,
      getData: mockGetData,
      updateState: jest.fn(),
    });

    // Act
    render(<FsmComponent />);
    const closeButton = screen.getByRole('button', { name: /×/i });
    fireEvent.click(closeButton);

    // Assert
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockGetData).toHaveBeenCalled();
  });

  it('should display current state and next states when contentLoading is false', () => {
    // Arrange
    const mockUpdateState = jest.fn();
    mockUseFsmStates.mockReturnValue({
      states: mockStates,
      currentState: mockCurrentState,
      nextStates: mockNextStates,
      pageLoading: false,
      contentLoading: false,
      error: null,
      setError: jest.fn(),
      getData: jest.fn(),
      updateState: mockUpdateState,
    });

    // Act
    render(<FsmComponent />);

    // Assert
    const idleItems = screen.getAllByText(mockCurrentState.label);
    expect(idleItems.length).toBe(2);
    const loadingItems = screen.getAllByText(mockNextStates[0].label);
    for (let i = 0; i < idleItems.length; i++) {
      console.log(`**loadingItems[${i}]**`);
      console.log(loadingItems[i].innerHTML);
    }
    // expect(screen.getByText('Next Possible States')).toBeInTheDocument();
    // expect(screen.getByText(mockNextStates[0].label)).toBeInTheDocument();
  });

  it('should call updateState when a next state is clicked', () => {
    // Arrange
    const mockUpdateState = jest.fn();
    mockUseFsmStates.mockReturnValue({
      states: mockStates,
      currentState: mockCurrentState,
      nextStates: mockNextStates,
      pageLoading: false,
      contentLoading: false,
      error: null,
      setError: jest.fn(),
      getData: jest.fn(),
      updateState: mockUpdateState,
    });

    // Act
    render(<FsmComponent />);
    const nextState = screen.getByText(mockNextStates[0].label);
    fireEvent.click(nextState);

    // Assert
    expect(mockUpdateState).toHaveBeenCalledWith(mockNextStates[0]);
  });

  it('should show a spinner when contentLoading is true', () => {
    // Arrange
    mockUseFsmStates.mockReturnValue({
      states: mockStates,
      currentState: undefined,
      nextStates: [],
      pageLoading: false,
      contentLoading: true,
      error: null,
      setError: jest.fn(),
      getData: jest.fn(),
      updateState: jest.fn(),
    });

    // Act
    render(<FsmComponent />);

    // Assert
    expect(screen.getByLabelText(/Loading spinner/i)).toBeInTheDocument();
    expect(screen.queryByText(/Current State/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Next Possible States/i)).not.toBeInTheDocument();
  });

  it('should render the state tree when states and currentState are available', () => {
    // Arrange
    mockUseFsmStates.mockReturnValue({
      states: mockStates,
      currentState: mockCurrentState,
      nextStates: [],
      pageLoading: false,
      contentLoading: false,
      error: null,
      setError: jest.fn(),
      getData: jest.fn(),
      updateState: jest.fn(),
    });

    // Act
    render(<FsmComponent />);

    // Assert
    expect(screen.getByText('State Tree')).toBeInTheDocument();
    expect(screen.getByText(mockCurrentState.label)).toBeInTheDocument();
  });

  it('should show a message when no current state is available', () => {
    // Arrange
    mockUseFsmStates.mockReturnValue({
      states: mockStates,
      currentState: undefined,
      nextStates: [],
      pageLoading: false,
      contentLoading: false,
      error: null,
      setError: jest.fn(),
      getData: jest.fn(),
      updateState: jest.fn(),
    });

    // Act
    render(<FsmComponent />);

    // Assert
    expect(screen.getByText(/No current state available/i)).toBeInTheDocument();
  });
});
