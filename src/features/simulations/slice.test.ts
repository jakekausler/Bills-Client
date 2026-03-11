import { describe, it, expect } from 'vitest';
import reducer, {
  setSimulations,
  setSimulationsLoaded,
  setUsedVariables,
  setUsedVariablesLoaded,
} from './slice';
import { Simulation, UsedVariableMap } from '../../types/types';

const makeSimulation = (overrides: Partial<Simulation> = {}): Simulation => ({
  name: 'Base Case',
  variables: {},
  enabled: true,
  selected: false,
  ...overrides,
});

const initialState = {
  simulations: [],
  simulationsLoaded: false,
  usedVariables: {},
  usedVariablesLoaded: false,
};

describe('simulationsSlice reducer', () => {
  describe('initial state', () => {
    it('returns the initial state when called with undefined state', () => {
      const state = reducer(undefined, { type: '@@INIT' });
      expect(state.simulations).toEqual([]);
      expect(state.simulationsLoaded).toBe(false);
      expect(state.usedVariables).toEqual({});
      expect(state.usedVariablesLoaded).toBe(false);
    });
  });

  describe('setSimulations', () => {
    it('sets simulations and marks them as loaded', () => {
      const simulations = [makeSimulation({ name: 'Base Case' })];
      const state = reducer(initialState, setSimulations(simulations));
      expect(state.simulations).toEqual(simulations);
      expect(state.simulationsLoaded).toBe(true);
    });

    it('replaces existing simulations', () => {
      const stateWithSimulations = {
        ...initialState,
        simulations: [makeSimulation({ name: 'Old Simulation' })],
        simulationsLoaded: true,
      };
      const newSimulations = [makeSimulation({ name: 'New Simulation' })];
      const state = reducer(stateWithSimulations, setSimulations(newSimulations));
      expect(state.simulations).toHaveLength(1);
      expect(state.simulations[0].name).toBe('New Simulation');
    });

    it('sets simulations to empty array and marks as loaded', () => {
      const stateWithSimulations = {
        ...initialState,
        simulations: [makeSimulation()],
        simulationsLoaded: true,
      };
      const state = reducer(stateWithSimulations, setSimulations([]));
      expect(state.simulations).toEqual([]);
      expect(state.simulationsLoaded).toBe(true);
    });

    it('sets multiple simulations', () => {
      const simulations = [
        makeSimulation({ name: 'Base Case', selected: true }),
        makeSimulation({ name: 'Optimistic', selected: false }),
        makeSimulation({ name: 'Pessimistic', selected: false }),
      ];
      const state = reducer(initialState, setSimulations(simulations));
      expect(state.simulations).toHaveLength(3);
      expect(state.simulationsLoaded).toBe(true);
    });

    it('preserves simulation with variables', () => {
      const simulation = makeSimulation({
        name: 'With Variables',
        variables: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          INFLATION: { type: 'number', value: 0.03 },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          RATE: { type: 'number', value: 0.05 },
        },
      });
      const state = reducer(initialState, setSimulations([simulation]));
      expect(state.simulations[0].variables).toEqual({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        INFLATION: { type: 'number', value: 0.03 },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        RATE: { type: 'number', value: 0.05 },
      });
    });
  });

  describe('setSimulationsLoaded', () => {
    it('sets simulationsLoaded to true', () => {
      const state = reducer(initialState, setSimulationsLoaded(true));
      expect(state.simulationsLoaded).toBe(true);
    });

    it('sets simulationsLoaded to false', () => {
      const loadedState = { ...initialState, simulationsLoaded: true };
      const state = reducer(loadedState, setSimulationsLoaded(false));
      expect(state.simulationsLoaded).toBe(false);
    });

    it('does not affect simulations array', () => {
      const simulations = [makeSimulation()];
      const stateWithSimulations = { ...initialState, simulations };
      const state = reducer(stateWithSimulations, setSimulationsLoaded(true));
      expect(state.simulations).toEqual(simulations);
    });
  });

  describe('setUsedVariables', () => {
    it('sets used variables and marks them as loaded', () => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const usedVariables: UsedVariableMap = {
        INFLATION: [{ name: 'INFLATION', type: 'number', date: '2024-01-01' }],
      };
      /* eslint-enable @typescript-eslint/naming-convention */
      const state = reducer(initialState, setUsedVariables(usedVariables));
      expect(state.usedVariables).toEqual(usedVariables);
      expect(state.usedVariablesLoaded).toBe(true);
    });

    it('replaces existing used variables', () => {
      const stateWithVars = {
        ...initialState,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        usedVariables: { OLD_VAR: [{ name: 'OLD_VAR', type: 'number' }] },
        usedVariablesLoaded: true,
      };
      /* eslint-disable @typescript-eslint/naming-convention */
      const newVariables: UsedVariableMap = {
        NEW_VAR: [{ name: 'NEW_VAR', type: 'string' }],
      };
      /* eslint-enable @typescript-eslint/naming-convention */
      const state = reducer(stateWithVars, setUsedVariables(newVariables));
      expect(state.usedVariables).toEqual(newVariables);
      expect(state.usedVariables).not.toHaveProperty('OLD_VAR');
    });

    it('sets used variables to empty object and marks as loaded', () => {
      const stateWithVars = {
        ...initialState,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        usedVariables: { VAR: [{ name: 'VAR', type: 'number' }] },
        usedVariablesLoaded: true,
      };
      const state = reducer(stateWithVars, setUsedVariables({}));
      expect(state.usedVariables).toEqual({});
      expect(state.usedVariablesLoaded).toBe(true);
    });

    it('handles used variables with account and transfer fields', () => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const usedVariables: UsedVariableMap = {
        TRANSFER_RATE: [
          { name: 'TRANSFER_RATE', type: 'number', from: 'Checking', to: 'Savings' },
        ],
      };
      /* eslint-enable @typescript-eslint/naming-convention */
      const state = reducer(initialState, setUsedVariables(usedVariables));
      expect(state.usedVariables['TRANSFER_RATE'][0].from).toBe('Checking');
      expect(state.usedVariables['TRANSFER_RATE'][0].to).toBe('Savings');
    });
  });

  describe('setUsedVariablesLoaded', () => {
    it('sets usedVariablesLoaded to true', () => {
      const state = reducer(initialState, setUsedVariablesLoaded(true));
      expect(state.usedVariablesLoaded).toBe(true);
    });

    it('sets usedVariablesLoaded to false', () => {
      const loadedState = { ...initialState, usedVariablesLoaded: true };
      const state = reducer(loadedState, setUsedVariablesLoaded(false));
      expect(state.usedVariablesLoaded).toBe(false);
    });

    it('does not affect usedVariables object', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const usedVariables: UsedVariableMap = { VAR: [{ name: 'VAR', type: 'number' }] };
      const stateWithVars = { ...initialState, usedVariables };
      const state = reducer(stateWithVars, setUsedVariablesLoaded(true));
      expect(state.usedVariables).toEqual(usedVariables);
    });
  });
});
