import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { useEffect } from 'react';
import {
  selectGraphViewEndDate,
  selectGraphViewStartDate,
  selectSelectedAccounts,
  selectSelectedSimulations,
} from '../../features/graphView/select';
import { updateSelectedAccounts, updateSelectedSimulations } from '../../features/graphView/slice';
import { loadGraphViewData } from '../../features/graphView/actions';
import AccountSelector from '../accounts/accountSelector';
import { Stack } from '@mantine/core';
import SimulationSelector from '../simulations/simulationSelector';

export default function GraphViewAccountSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAccounts = useSelector(selectSelectedAccounts);
  const selectedSimulations = useSelector(selectSelectedSimulations);
  const startDate = useSelector(selectGraphViewStartDate);
  const endDate = useSelector(selectGraphViewEndDate);

  useEffect(() => {
    dispatch(loadGraphViewData(selectedAccounts, selectedSimulations, startDate, endDate));
  }, [selectedAccounts, startDate, endDate]);

  return (
    <Stack>
      <AccountSelector selectedAccounts={selectedAccounts} updateSelectedAccounts={updateSelectedAccounts} />
      <SimulationSelector
        selectedSimulations={selectedSimulations}
        updateSelectedSimulations={updateSelectedSimulations}
      />
    </Stack>
  );
}
