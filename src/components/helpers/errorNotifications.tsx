import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import type { AppDispatch } from '../../store';

// Import all error selectors
import { selectAccountsError } from '../../features/accounts/select';
import { selectActivitiesError } from '../../features/activities/select';
import { selectBillsError } from '../../features/calendar/select';
import { selectCategoriesError } from '../../features/categories/select';
import { selectFlowError } from '../../features/flow/select';
import { selectGraphError } from '../../features/graph/select';
import { selectGraphViewError } from '../../features/graphView/select';
import { selectHealthcareError } from '../../features/healthcare/select';
import { selectMoneyMovementError } from '../../features/moneyMovement/select';
import { selectMonteCarloError } from '../../features/monteCarlo/select';
import { selectSimulationsError } from '../../features/simulations/select';
import { selectSpendingTrackerError } from '../../features/spendingTracker/select';

// Import all error-clearing actions
import { setAccountsError } from '../../features/accounts/slice';
import { setActivitiesError } from '../../features/activities/slice';
import { setBillsError } from '../../features/calendar/slice';
import { setCategoriesError } from '../../features/categories/slice';
import { setFlowError } from '../../features/flow/slice';
import { setGraphError } from '../../features/graph/slice';
import { setGraphViewError } from '../../features/graphView/slice';
import { setError as setHealthcareError } from '../../features/healthcare/slice';
import { setMoneyMovementError } from '../../features/moneyMovement/slice';
import { setMonteCarloError } from '../../features/monteCarlo/slice';
import { setSimulationsError } from '../../features/simulations/slice';
import { setError as setSpendingTrackerError } from '../../features/spendingTracker/slice';

export function ErrorNotifications() {
  const dispatch = useDispatch<AppDispatch>();

  const accountsError = useSelector(selectAccountsError);
  const activitiesError = useSelector(selectActivitiesError);
  const billsError = useSelector(selectBillsError);
  const categoriesError = useSelector(selectCategoriesError);
  const flowError = useSelector(selectFlowError);
  const graphError = useSelector(selectGraphError);
  const graphViewError = useSelector(selectGraphViewError);
  const healthcareError = useSelector(selectHealthcareError);
  const moneyMovementError = useSelector(selectMoneyMovementError);
  const monteCarloError = useSelector(selectMonteCarloError);
  const simulationsError = useSelector(selectSimulationsError);
  const spendingTrackerError = useSelector(selectSpendingTrackerError);

  const errors = [
    { value: accountsError, title: 'Account Error', clear: () => dispatch(setAccountsError('')) },
    { value: activitiesError, title: 'Activity Error', clear: () => dispatch(setActivitiesError('')) },
    { value: billsError, title: 'Calendar Error', clear: () => dispatch(setBillsError('')) },
    { value: categoriesError, title: 'Categories Error', clear: () => dispatch(setCategoriesError('')) },
    { value: flowError, title: 'Flow Error', clear: () => dispatch(setFlowError('')) },
    { value: graphError, title: 'Graph Error', clear: () => dispatch(setGraphError('')) },
    { value: graphViewError, title: 'Graph View Error', clear: () => dispatch(setGraphViewError('')) },
    { value: healthcareError, title: 'Healthcare Error', clear: () => dispatch(setHealthcareError(null)) },
    { value: moneyMovementError, title: 'Money Movement Error', clear: () => dispatch(setMoneyMovementError('')) },
    { value: monteCarloError, title: 'Monte Carlo Error', clear: () => dispatch(setMonteCarloError('')) },
    { value: simulationsError, title: 'Simulations Error', clear: () => dispatch(setSimulationsError('')) },
    { value: spendingTrackerError, title: 'Spending Tracker Error', clear: () => dispatch(setSpendingTrackerError(null)) },
  ];

  useEffect(() => {
    for (const { value, title, clear } of errors) {
      if (value) {
        notifications.show({
          title,
          message: value,
          color: 'red',
          icon: <IconX size={16} />,
          autoClose: 8000,
          withCloseButton: true,
        });
        clear();
      }
    }
  }, [accountsError, activitiesError, billsError, categoriesError, flowError, graphError, graphViewError, healthcareError, moneyMovementError, monteCarloError, simulationsError, spendingTrackerError, dispatch]);

  return null;
}
