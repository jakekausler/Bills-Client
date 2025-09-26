import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { useEffect } from 'react';
import {
  selectGraphViewEndDate,
  selectGraphViewStartDate,
  selectSelectedAccounts,
  selectSelectedSimulations,
  selectCombineAccounts,
} from '../../features/graphView/select';
import { updateSelectedAccounts, updateSelectedSimulations, setCombineAccounts } from '../../features/graphView/slice';
import { loadGraphViewData } from '../../features/graphView/actions';
import AccountSelector from '../accounts/accountSelector';
import { Stack, Switch } from '@mantine/core';
import SimulationSelector from '../simulations/simulationSelector';

export default function GraphViewAccountSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAccounts = useSelector(selectSelectedAccounts);
  const selectedSimulations = useSelector(selectSelectedSimulations);
  const startDate = useSelector(selectGraphViewStartDate);
  const endDate = useSelector(selectGraphViewEndDate);
  const combineAccounts = useSelector(selectCombineAccounts);

  useEffect(() => {
    dispatch(loadGraphViewData(selectedAccounts, selectedSimulations, startDate, endDate, combineAccounts));
  }, [selectedAccounts, startDate, endDate, combineAccounts]);

  return (
    <Stack>
      <AccountSelector selectedAccounts={selectedAccounts} updateSelectedAccounts={updateSelectedAccounts} />
      <SimulationSelector
        selectedSimulations={selectedSimulations}
        updateSelectedSimulations={updateSelectedSimulations}
      />
      <Switch
        label="Combine Accounts"
        checked={combineAccounts}
        onChange={(event) => dispatch(setCombineAccounts(event.currentTarget.checked))}
      />
    </Stack>
  );
}
