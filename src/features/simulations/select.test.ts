import { describe, it, expect } from 'vitest';
import {
  selectSimulations,
  selectSelectedSimulation,
  selectSelectedSimulationVariables,
  selectSimulationsLoaded,
  selectUsedVariables,
  selectUsedVariablesLoaded,
} from './select';
import { Simulation, UsedVariableMap } from '../../types/types';

const makeSimulation = (overrides: Partial<Simulation> = {}): Simulation => ({
  name: 'Base Case',
  variables: {},
  enabled: true,
  selected: false,
  ...overrides,
});

const makeRootState = (simulationsOverrides = {}) =>
  ({
    simulations: {
      simulations: [],
      simulationsLoaded: false,
      usedVariables: {},
      usedVariablesLoaded: false,
      ...simulationsOverrides,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

describe('simulations selectors', () => {
  describe('selectSimulations', () => {
    it('returns all simulations from state', () => {
      const simulations = [
        makeSimulation({ name: 'Base Case' }),
        makeSimulation({ name: 'Optimistic' }),
      ];
      const state = makeRootState({ simulations });
      expect(selectSimulations(state)).toEqual(simulations);
    });

    it('returns empty array when no simulations', () => {
      const state = makeRootState({ simulations: [] });
      expect(selectSimulations(state)).toEqual([]);
    });
  });

  describe('selectSimulationsLoaded', () => {
    it('returns false when simulations are not loaded', () => {
      const state = makeRootState({ simulationsLoaded: false });
      expect(selectSimulationsLoaded(state)).toBe(false);
    });

    it('returns true when simulations are loaded', () => {
      const state = makeRootState({ simulationsLoaded: true });
      expect(selectSimulationsLoaded(state)).toBe(true);
    });
  });

  describe('selectSelectedSimulation', () => {
    it('returns the simulation that has selected: true', () => {
      const simulations = [
        makeSimulation({ name: 'Base Case', selected: false }),
        makeSimulation({ name: 'Optimistic', selected: true }),
        makeSimulation({ name: 'Pessimistic', selected: false }),
      ];
      const state = makeRootState({ simulations });
      const selected = selectSelectedSimulation(state);
      expect(selected?.name).toBe('Optimistic');
    });

    it('returns undefined when no simulation is selected', () => {
      const simulations = [
        makeSimulation({ name: 'Base Case', selected: false }),
        makeSimulation({ name: 'Optimistic', selected: false }),
      ];
      const state = makeRootState({ simulations });
      expect(selectSelectedSimulation(state)).toBeUndefined();
    });

    it('returns undefined when simulations array is empty', () => {
      const state = makeRootState({ simulations: [] });
      expect(selectSelectedSimulation(state)).toBeUndefined();
    });

    it('returns the first selected simulation when multiple are selected', () => {
      const simulations = [
        makeSimulation({ name: 'First Selected', selected: true }),
        makeSimulation({ name: 'Second Selected', selected: true }),
      ];
      const state = makeRootState({ simulations });
      expect(selectSelectedSimulation(state)?.name).toBe('First Selected');
    });
  });

  describe('selectSelectedSimulationVariables', () => {
    it('returns variables of the selected simulation', () => {
       
      const variables = {
        INFLATION: { type: 'number', value: 0.03 },
        RATE: { type: 'number', value: 0.07 },
      };
       
      const simulations = [
        makeSimulation({ name: 'Base Case', selected: true, variables }),
      ];
      const state = makeRootState({ simulations });
      expect(selectSelectedSimulationVariables(state)).toEqual(variables);
    });

    it('returns undefined when no simulation is selected', () => {
      const simulations = [makeSimulation({ selected: false })];
      const state = makeRootState({ simulations });
      expect(selectSelectedSimulationVariables(state)).toBeUndefined();
    });

    it('returns empty object when selected simulation has no variables', () => {
      const simulations = [makeSimulation({ selected: true, variables: {} })];
      const state = makeRootState({ simulations });
      expect(selectSelectedSimulationVariables(state)).toEqual({});
    });

    it('returns undefined when simulations array is empty', () => {
      const state = makeRootState({ simulations: [] });
      expect(selectSelectedSimulationVariables(state)).toBeUndefined();
    });
  });

  describe('selectUsedVariables', () => {
    it('returns the usedVariables map from state', () => {
       
      const usedVariables: UsedVariableMap = {
        INFLATION: [{ name: 'INFLATION', type: 'number', date: '2024-01-01' }],
      };
       
      const state = makeRootState({ usedVariables });
      expect(selectUsedVariables(state)).toEqual(usedVariables);
    });

    it('returns empty object when no used variables', () => {
      const state = makeRootState({ usedVariables: {} });
      expect(selectUsedVariables(state)).toEqual({});
    });
  });

  describe('selectUsedVariablesLoaded', () => {
    it('returns false when used variables are not loaded', () => {
      const state = makeRootState({ usedVariablesLoaded: false });
      expect(selectUsedVariablesLoaded(state)).toBe(false);
    });

    it('returns true when used variables are loaded', () => {
      const state = makeRootState({ usedVariablesLoaded: true });
      expect(selectUsedVariablesLoaded(state)).toBe(true);
    });
  });
});
