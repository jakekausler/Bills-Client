import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useEffect } from "react";
import { selectSelectedAccounts } from "../../features/categories/select";
import { updateSelectedAccounts } from "../../features/categories/slice";
import AccountSelector from "../accounts/accountSelector";
import { loadCategories } from "../../features/categories/actions";

export default function GraphViewAccountSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAccounts = useSelector(selectSelectedAccounts);

  useEffect(() => {
    dispatch(loadCategories());
  }, [selectedAccounts]);

  return (
    <AccountSelector
      selectedAccounts={selectedAccounts}
      updateSelectedAccounts={updateSelectedAccounts}
    />
  );
}
