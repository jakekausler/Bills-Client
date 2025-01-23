import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useEffect } from "react";
import { selectGraphViewEndDate, selectSelectedAccounts } from "../../features/graphView/select";
import { updateSelectedAccounts } from "../../features/graphView/slice";
import { loadGraphViewData } from "../../features/graphView/actions";
import AccountSelector from "../accounts/accountSelector";

export default function GraphViewAccountSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAccounts = useSelector(selectSelectedAccounts);
  const endDate = useSelector(selectGraphViewEndDate);

  useEffect(() => {
    dispatch(loadGraphViewData(selectedAccounts, endDate));
  }, [selectedAccounts, endDate]);

  return (
    <AccountSelector
      selectedAccounts={selectedAccounts}
      updateSelectedAccounts={updateSelectedAccounts}
    />
  );
}
