import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { selectSelectedAccounts } from '../../features/flow/selector';
import { updateSelectedAccounts } from '../../features/flow/slice';
import AccountSelector from '../accounts/accountSelector';
import { loadFlow } from '../../features/flow/actions';
export default function GraphViewAccountSelector() {
    const dispatch = useDispatch();
    const selectedAccounts = useSelector(selectSelectedAccounts);
    useEffect(() => {
        dispatch(loadFlow());
    }, [selectedAccounts]);
    return React.createElement(AccountSelector, { selectedAccounts: selectedAccounts, updateSelectedAccounts: updateSelectedAccounts });
}
