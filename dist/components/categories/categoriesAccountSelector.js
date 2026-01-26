import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { selectSelectedAccounts } from '../../features/categories/select';
import { updateSelectedAccounts } from '../../features/categories/slice';
import AccountSelector from '../accounts/accountSelector';
import { loadCategories } from '../../features/categories/actions';
export default function GraphViewAccountSelector() {
    const dispatch = useDispatch();
    const selectedAccounts = useSelector(selectSelectedAccounts);
    useEffect(() => {
        dispatch(loadCategories());
    }, [selectedAccounts]);
    return React.createElement(AccountSelector, { selectedAccounts: selectedAccounts, updateSelectedAccounts: updateSelectedAccounts });
}
