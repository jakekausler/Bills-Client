import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { useEffect } from 'react';
import { selectFlowSelectedAccounts } from '../../features/flow/selector';
import { updateSelectedAccounts } from '../../features/flow/slice';
import AccountSelector from '../accounts/accountSelector';
import { loadFlow } from '../../features/flow/actions';

export default function FlowAccountSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAccounts = useSelector(selectFlowSelectedAccounts);

  useEffect(() => {
    dispatch(loadFlow());
  }, [selectedAccounts]);

  return <AccountSelector selectedAccounts={selectedAccounts} updateSelectedAccounts={updateSelectedAccounts} />;
}
