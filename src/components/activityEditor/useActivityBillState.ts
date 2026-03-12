import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMantineTheme } from '@mantine/core';
import { selectCategories } from '../../features/categories/select';
import { selectAllAccounts } from '../../features/accounts/select';
import {
  selectNames,
  selectNamesLoaded,
} from '../../features/activities/select';
import { selectSpendingTrackerCategoryOptions } from '../../features/spendingTracker/select';
import { useGroupedAccounts } from '../../hooks/useGroupedAccounts';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';

export function useActivityBillState() {
  const theme = useMantineTheme();
  const [categoryTouched, setCategoryTouched] = useState(false);

  // Categories transformation
  const categoryMap = useSelector(selectCategories);
  const categories = useMemo(() => {
    return Object.entries(categoryMap).map(([group, items]) => ({
      group,
      items: items.map((item) => ({
        value: `${group}.${item}`,
        label: item,
      })),
    }));
  }, [categoryMap]);

  // Accounts
  const accounts = useSelector(selectAllAccounts);
  const accountList = useGroupedAccounts(accounts);

  // Names
  const names = useSelector(selectNames);

  // Date variables from simulation variables
  const simulationVariables = useSelector(selectSelectedSimulationVariables);
  const dateVariables = useMemo(
    () =>
      simulationVariables
        ? Object.entries(simulationVariables)
            .filter(([_, value]) => value.type === 'date')
            .map(([name, _]) => name)
        : [],
    [simulationVariables],
  );

  // Loading states
  const namesLoaded = useSelector(selectNamesLoaded);

  // Spending category options
  const spendingCategoryOptions = useSelector(selectSpendingTrackerCategoryOptions);

  return {
    theme,
    categoryTouched,
    setCategoryTouched,
    categories,
    accounts,
    accountList,
    names,
    namesLoaded,
    dateVariables,
    spendingCategoryOptions,
  };
}
