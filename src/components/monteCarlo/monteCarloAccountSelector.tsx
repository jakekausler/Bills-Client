import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { useEffect } from 'react';
import {
  selectMonteCarloEndDate,
  selectMonteCarloSelectedAccounts,
  selectMonteCarloStartDate,
  selectNSimulations,
} from '../../features/monteCarlo/select';
import { updateSelectedAccounts } from '../../features/monteCarlo/slice';
import { loadMonteCarloData } from '../../features/monteCarlo/actions';
import AccountSelector from '../accounts/accountSelector';

export default function GraphViewAccountSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAccounts = useSelector(selectMonteCarloSelectedAccounts);
  const startDate = useSelector(selectMonteCarloStartDate);
  const endDate = useSelector(selectMonteCarloEndDate);
  const nSimulations = useSelector(selectNSimulations);

  useEffect(() => {
    dispatch(loadMonteCarloData(startDate, endDate, selectedAccounts, nSimulations));
  }, [selectedAccounts, startDate, endDate, nSimulations]);

  return <AccountSelector selectedAccounts={selectedAccounts} updateSelectedAccounts={updateSelectedAccounts} />;
}
