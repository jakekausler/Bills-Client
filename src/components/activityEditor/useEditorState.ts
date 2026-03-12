import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import {
  selectEndDate,
  selectStartDate,
} from '../../features/activities/select';
import {
  selectAccountsLoaded,
  selectSelectedAccount,
} from '../../features/accounts/select';
import { selectCategoriesLoaded } from '../../features/categories/select';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';

export function useEditorState() {
  const dispatch = useDispatch<AppDispatch>();
  const account = useSelector(selectSelectedAccount);

  // Date selectors (shared by all 3)
  const startDateStr = useSelector(selectStartDate);
  const endDateStr = useSelector(selectEndDate);
  const graphStartDateStr = useSelector(selectGraphStartDate);
  const graphEndDateStr = useSelector(selectGraphEndDate);

  const startDate = useMemo(() => new Date(startDateStr), [startDateStr]);
  const endDate = useMemo(() => new Date(endDateStr), [endDateStr]);
  const graphStartDate = useMemo(() => new Date(graphStartDateStr), [graphStartDateStr]);
  const graphEndDate = useMemo(() => new Date(graphEndDateStr), [graphEndDateStr]);

  // Loading states (shared by all 3)
  const accountsLoaded = useSelector(selectAccountsLoaded);
  const categoriesLoaded = useSelector(selectCategoriesLoaded);

  // Simulation variables (shared by all 3)
  const simulationVariables = useSelector(selectSelectedSimulationVariables);
  const amountVariables = useMemo(
    () =>
      simulationVariables
        ? Object.entries(simulationVariables)
            .filter(([_, value]) => value.type === 'amount')
            .map(([name, _]) => name)
        : [],
    [simulationVariables],
  );

  const dateVariables = useMemo(
    () =>
      simulationVariables
        ? Object.entries(simulationVariables)
            .filter(([_, value]) => value.type === 'date')
            .map(([name, _]) => name)
        : [],
    [simulationVariables],
  );

  return {
    dispatch,
    account,
    startDate,
    endDate,
    graphStartDate,
    graphEndDate,
    accountsLoaded,
    categoriesLoaded,
    simulationVariables,
    amountVariables,
    dateVariables,
  };
}
