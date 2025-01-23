import { useDispatch, useSelector } from "react-redux";
import {
  selectEndDate,
  selectNames,
  selectNamesLoaded,
  selectSelectedBill,
  selectSelectedBillLoaded,
  selectStartDate,
} from "../../features/activities/select";
import {
  ActionIcon,
  Button,
  Checkbox,
  FocusTrap,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { selectCategories, selectCategoriesLoaded } from "../../features/categories/select";
import {
  selectAccountsLoaded,
  selectAllAccounts,
  selectSelectedAccount,
} from "../../features/accounts/select";
import { selectGraphEndDate } from "../../features/graph/select";
import { AppDispatch } from "../../store";
import { DateInput } from "@mantine/dates";
import { updateBill } from "../../features/activities/slice";
import { Account, Bill } from "../../types/types";
import { removeBill, saveBill } from "../../features/activities/actions";
import { IconVariable, IconVariableOff } from "@tabler/icons-react";
import { selectSelectedSimulationVariables } from "../../features/simulations/select";
import { toDateString } from "../../utils/date";
import CreatableSelect from "../helpers/creatableSelect";
import { useEffect, useState } from "react";
import { EditableDateInput } from "../helpers/editableDateInput";

export const BillEditor = ({
  resetSelected,
}: {
  resetSelected: () => void;
}) => {
  const selectedBill = useSelector(selectSelectedBill);
  const billId = selectedBill?.id;
  const categories = Object.entries(useSelector(selectCategories)).map(
    ([group, items]) => ({
      group,
      items: items.map((item) => ({
        value: `${group}.${item}`,
        label: item,
      })),
    }),
  );
  const accounts = useSelector(selectAllAccounts).map((account) => ({
    value: account.name,
    label: account.name,
  }));
  const account = useSelector(selectSelectedAccount);
  const startDate = new Date(useSelector(selectStartDate));
  const endDate = new Date(useSelector(selectEndDate));
  const graphEndDate = new Date(useSelector(selectGraphEndDate));
  const billLoaded = useSelector(selectSelectedBillLoaded);
  const accountsLoaded = useSelector(selectAccountsLoaded);
  const categoriesLoaded = useSelector(selectCategoriesLoaded);
  const namesLoaded = useSelector(selectNamesLoaded);

  const dispatch = useDispatch<AppDispatch>();

  const [categoryTouched, setCategoryTouched] = useState(false);
  const names = useSelector(selectNames);

  const simulationVariables = useSelector(selectSelectedSimulationVariables);
  const amountVariables = simulationVariables
    ? Object.entries(simulationVariables)
      .filter(([_, value]) => value.type === "amount")
      .map(([name, _]) => name)
    : [];
  const dateVariables = simulationVariables
    ? Object.entries(simulationVariables)
      .filter(([_, value]) => value.type === "date")
      .map(([name, _]) => name)
    : [];

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const isLoading = !billLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [billLoaded, accountsLoaded, categoriesLoaded, namesLoaded]);

  const validate = (name: string, value: any) => {
    if (!selectedBill) {
      return null;
    }
    if (name === "start_date_variable") {
      if (selectedBill.start_date_is_variable) {
        if (!dateVariables.includes(value)) {
          return "Invalid start_date";
        }
      }
    }
    if (name === "start_date") {
      const date = new Date(value);
      if (date.toString() === "Invalid Date") {
        return "Invalid date";
      }
    }
    if (name === "end_date_variable") {
      if (selectedBill.end_date_is_variable) {
        if (!!value && !dateVariables.includes(value)) {
          return "Invalid end_date";
        }
      }
    }
    if (name === "end_date") {
      if (value === "" || value === undefined || value === null) {
        return null;
      }
      const date = new Date(value);
      if (date.toString() === "Invalid Date") {
        return "Invalid date";
      }
    }
    if (name === "amount_variable") {
      if (selectedBill.amount_is_variable) {
        if (!amountVariables.includes(value) && value !== "{HALF}" && value !== "{FULL}") {
          return "Invalid amount";
        }
      }
    }
    if (name === "amount") {
      if (isNaN(value) || typeof value === "boolean") {
        return "Invalid amount";
      }
    }
    if (name === "is_transfer") {
      if (typeof value !== "boolean") {
        return "Invalid is_transfer";
      }
    }
    if (name === "from" || name === "to") {
      if (selectedBill && !selectedBill.is_transfer) {
        return null;
      }
      if (!accounts.find((a) => a.value === value)) {
        return "Invalid account";
      }
    }
    if (name === "category") {
      if (!categories.find((c) => !!c.items.find((i) => i.value === value))) {
        return "Invalid category";
      }
    }
    if (name === "name") {
      if (!selectedBill.name || selectedBill.name.trim() === "") {
        return "Invalid name";
      }
    }
    if (name === "every_n") {
      if (isNaN(value) || typeof value === "boolean") {
        return "Invalid every_n";
      }
    }
    if (name === "periods") {
      if (!["day", "week", "month", "year"].includes(value)) {
        return "Invalid periods";
      }
    }
    if (name === "annual_start_date" || name === "annual_end_date") {
      if (value === "" || value === undefined || value === null) {
        return null;
      }
      const dateParts = value.split('/');
      if (dateParts.length !== 2) {
        return "Invalid date format - use MM/DD";
      }

      const month = parseInt(dateParts[0]);
      const day = parseInt(dateParts[1]);

      if (isNaN(month) || month < 1 || month > 12) {
        return "Invalid month";
      }

      if (month < 10 && dateParts[0].length === 1) {
        return "Please use 01, 02, 03, etc.";
      }

      if (day < 10 && dateParts[1].length === 1) {
        return "Please use 01, 02, 03, etc.";
      }

      const daysInMonth = new Date(2024, month, 0).getDate();
      if (isNaN(day) || day < 1 || day > daysInMonth) {
        return "Invalid day for month";
      }
    }
    return null;
  };

  const allValid = () => {
    if (!selectedBill) {
      return true;
    }
    return Object.entries(selectedBill).every(([key, value]) => {
      return validate(key, value) === null;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!allValid()) {
        return;
      }
      dispatch(
        saveBill(
          account as Account,
          selectedBill as Bill,
          startDate,
          endDate,
          graphEndDate,
        ),
      );
      resetSelected();
    }
  };

  return (
    <Stack h="100%" w="100%" justify="space-between" pos="relative">
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      {selectedBill ? (
        <>
          <FocusTrap.InitialFocus />
          <Group w="100%">
            {!selectedBill.start_date_is_variable && (
              <EditableDateInput
                label="Start date"
                value={selectedBill.start_date}
                onBlur={(value) => {
                  if (!value) return;
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      start_date: value,
                    }),
                  );
                }}
                placeholder="Start date"
              />
            )}
            {selectedBill.start_date_is_variable && (
              <Select
                label="Start Date"
                value={selectedBill.start_date_variable as string}
                data={dateVariables.map((v) => ({ label: v, value: v }))}
                onChange={(v) => {
                  if (!v) return;
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      start_date_variable: v,
                    }),
                  );
                }}
                error={validate(
                  "start_date_variable",
                  selectedBill.start_date_variable,
                )}
              />
            )}
            <ActionIcon
              onClick={() => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    start_date_is_variable:
                      !selectedBill.start_date_is_variable,
                  }),
                );
              }}
            >
              {selectedBill.start_date_is_variable ? (
                <IconVariable />
              ) : (
                <IconVariableOff />
              )}
            </ActionIcon>
          </Group>
          <Group w="100%">
            {!selectedBill.end_date_is_variable && (
              <EditableDateInput
                label="End date"
                value={selectedBill.end_date}
                onBlur={(value) => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      end_date: value,
                    }),
                  );
                }}
                placeholder="End date"
              />
            )}
            {selectedBill.end_date_is_variable && (
              <Select
                label="End Date"
                value={selectedBill.end_date_variable as string}
                data={dateVariables.map((v) => ({ label: v, value: v }))}
                onChange={(v) => {
                  if (!v) return;
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      end_date_variable: v,
                    }),
                  );
                }}
                error={validate(
                  "end_date_variable",
                  selectedBill.end_date_variable,
                )}
              />
            )}
            <ActionIcon
              onClick={() => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    end_date_is_variable: !selectedBill.end_date_is_variable,
                  }),
                );
              }}
            >
              {selectedBill.end_date_is_variable ? (
                <IconVariable />
              ) : (
                <IconVariableOff />
              )}
            </ActionIcon>
          </Group>
          <CreatableSelect
            label="Name"
            error={validate("name", selectedBill.name)}
            value={selectedBill.name}
            onChange={(v: string | null) => {
              const newBill = {
                ...selectedBill,
                name: v || "",
              };
              if (!categoryTouched && v && v in names) {
                newBill.category = names[v];
              }
              dispatch(updateBill(newBill));
            }}
            data={Object.entries(names).map(([key, _value]) => ({
              label: key,
              value: key,
            }))}
            clearable
          />
          <Select
            label="Category"
            value={selectedBill.category}
            data={categories}
            onChange={(v) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  category: v ? v : "",
                }),
              );
              setCategoryTouched(true);
            }}
            searchable
            error={validate("category", selectedBill.category)}
          />
          <Checkbox
            label="Is this a transfer?"
            checked={selectedBill.is_transfer}
            onChange={(event) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  is_transfer: event.currentTarget.checked,
                }),
              );
            }}
            error={validate("is_transfer", selectedBill.is_transfer)}
          />
          {selectedBill.is_transfer && (
            <>
              <Select
                label="From Account"
                value={selectedBill.from}
                data={accounts}
                searchable
                placeholder="Select an account"
                onChange={(v) => {
                  dispatch(updateBill({ ...selectedBill, from: v }));
                }}
                error={validate("from", selectedBill.from)}
              />
              <Select
                label="To Account"
                value={selectedBill.to}
                data={accounts}
                searchable
                placeholder="Select an account"
                onChange={(v) => {
                  dispatch(updateBill({ ...selectedBill, to: v }));
                }}
                error={validate("to", selectedBill.to)}
              />
            </>
          )}
          <Group w="100%">
            {!selectedBill.amount_is_variable && (
              <NumberInput
                style={{ flex: 1 }}
                label="Amount"
                value={
                  selectedBill.is_transfer
                    ? Math.abs(selectedBill.amount as number)
                    : selectedBill.amount
                }
                onChange={(v) => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      amount: typeof v === "number" ? v : parseFloat(v),
                    }),
                  );
                }}
                prefix="$ "
                decimalScale={2}
                decimalSeparator="."
                error={validate("amount", selectedBill.amount)}
                onKeyDown={handleKeyDown}
              />
            )}
            {selectedBill.amount_is_variable && (
              <Select
                label="Amount"
                value={selectedBill.amount_variable as string}
                data={amountVariables.map((v) => ({ label: v, value: v })).concat([{ label: "{HALF}", value: "{HALF}" }, { label: "{FULL}", value: "{FULL}" }])}
                onChange={(v) => {
                  if (!v) return;
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      amount_variable: v,
                    }),
                  );
                }}
                error={validate(
                  "amount_variable",
                  selectedBill.amount_variable,
                )}
              />
            )}
            <ActionIcon
              onClick={() => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    amount_is_variable: !selectedBill.amount_is_variable,
                  }),
                );
              }}
            >
              {selectedBill.amount_is_variable ? (
                <IconVariable />
              ) : (
                <IconVariableOff />
              )}
            </ActionIcon>
          </Group>
          <Group grow w="100%">
            <NumberInput
              label="Every N"
              value={selectedBill.every_n}
              onChange={(v) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    every_n: typeof v === "number" ? v : parseInt(v),
                  }),
                );
              }}
              min={1}
              error={validate("every_n", selectedBill.every_n)}
              onKeyDown={handleKeyDown}
            />
            <Select
              label="Periods"
              value={selectedBill.periods}
              data={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year" },
              ]}
              onChange={(v) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    periods: v ? v : "",
                  }),
                );
              }}
              searchable
              error={validate("periods", selectedBill.periods)}
            />
          </Group>
          <Group w="100%">
            <TextInput
              label="Annual start date"
              value={selectedBill.annual_start_date || ""}
              onChange={(e) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    annual_start_date: e.target.value === "" ? null : e.target.value,
                  }),
                );
              }}
              error={validate("annual_start_date", selectedBill.annual_start_date)}
              placeholder="Annual start date"
            />
            <TextInput
              label="Annual end date"
              value={selectedBill.annual_end_date || ""}
              onChange={(e) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    annual_end_date: e.target.value === "" ? null : e.target.value,
                  }),
                );
              }}
              placeholder="Annual end date"
              error={validate("annual_end_date", selectedBill.annual_end_date)}
            />
          </Group>
          <Group w="100%" grow>
            <Button
              disabled={!allValid()}
              onClick={() => {
                dispatch(
                  saveBill(
                    account as Account,
                    selectedBill as Bill,
                    startDate,
                    endDate,
                    graphEndDate,
                  ),
                );
                resetSelected();
              }}
            >
              Save
            </Button>
            <Button
              disabled={!selectedBill.id}
              onClick={() => {
                dispatch(
                  removeBill(
                    account as Account,
                    billId as string,
                    selectedBill.is_transfer,
                    startDate,
                    endDate,
                    graphEndDate,
                  ),
                );
                resetSelected();
              }}
            >
              Remove
            </Button>
          </Group>
        </>
      ) : (
        <Text>No bill selected</Text>
      )}
    </Stack>
  );
};
