import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { useEffect } from 'react';
import { selectCalendarSelectedAccounts } from '../../features/calendar/select';
import { updateSelectedAccounts } from '../../features/calendar/slice';
import { loadCalendar } from '../../features/calendar/actions';
import AccountSelector from '../accounts/accountSelector';

export default function CalendarAccountSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAccounts = useSelector(selectCalendarSelectedAccounts);

  useEffect(() => {
    dispatch(loadCalendar());
  }, [selectedAccounts, dispatch]);

  return <AccountSelector selectedAccounts={selectedAccounts} updateSelectedAccounts={updateSelectedAccounts} />;
}
