import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useEffect } from "react";
import { selectSelectedAccounts } from "../../features/calendar/select";
import { updateSelectedAccounts } from "../../features/calendar/slice";
import { loadCalendar } from "../../features/calendar/actions";
import AccountSelector from "../accounts/accountSelector";

export default function GraphViewAccountSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAccounts = useSelector(selectSelectedAccounts);

  useEffect(() => {
    dispatch(loadCalendar());
  }, [selectedAccounts]);

  return (
    <AccountSelector
      selectedAccounts={selectedAccounts}
      updateSelectedAccounts={updateSelectedAccounts}
    />
  );
}
