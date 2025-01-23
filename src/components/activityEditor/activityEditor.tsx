import { useDispatch, useSelector } from "react-redux";
import {
  selectEndDate,
  selectNames,
  selectNamesLoaded,
  selectSelectedActivity,
  selectSelectedActivityBillId,
  selectSelectedActivityInterestId,
  selectSelectedActivityLoaded,
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
} from "@mantine/core";
import { AppDispatch } from "../../store";
import { updateActivity } from "../../features/activities/slice";
import { selectCategories, selectCategoriesLoaded } from "../../features/categories/select";
import {
  selectAccountsLoaded,
  selectAllAccounts,
  selectSelectedAccount,
} from "../../features/accounts/select";
import {
  removeActivity,
  saveActivity,
} from "../../features/activities/actions";
import { Activity } from "../../types/types";
import { selectGraphEndDate } from "../../features/graph/select";
import { IconVariable, IconVariableOff } from "@tabler/icons-react";
import {
  selectSelectedSimulationVariables,
} from "../../features/simulations/select";
import CreatableSelect from "../helpers/creatableSelect";
import { useEffect, useState } from "react";
import { EditableDateInput } from "../helpers/editableDateInput";

export const ActivityEditor = ({
  resetSelected,
}: {
  resetSelected: () => void;
}) => {
  const selectedActivity = useSelector(selectSelectedActivity);
  const activityId = selectedActivity?.id;
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
  const selectedBillId = useSelector(selectSelectedActivityBillId);
  const selectedInterestId = useSelector(selectSelectedActivityInterestId);
  const dispatch = useDispatch<AppDispatch>();
  const names = useSelector(selectNames);

  const accountsLoaded = useSelector(selectAccountsLoaded);
  const activityLoaded = useSelector(selectSelectedActivityLoaded);
  const categoriesLoaded = useSelector(selectCategoriesLoaded);
  const namesLoaded = useSelector(selectNamesLoaded);

  const [categoryTouched, setCategoryTouched] = useState(false);

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
    const isLoading = !activityLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [activityLoaded, accountsLoaded, categoriesLoaded, namesLoaded]);

  if (!account) {
    return <Text>No account selected</Text>;
  }

  if (!selectedActivity) {
    return <Text>No activity selected</Text>;
  }

  const validate = (name: string, value: any) => {
    if (name === "date_variable") {
      if (selectedActivity.date_is_variable) {
        if (!dateVariables.includes(value)) {
          return "Invalid date";
        }
      }
    }
    if (name === "date") {
      const date = new Date(value);
      if (date.toString() === "Invalid Date") {
        return "Invalid date";
      }
    }
    if (name === "amount_variable") {
      if (selectedActivity.amount_is_variable) {
        if (!amountVariables.includes(value)) {
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
    if (name === "flag") {
      if (typeof value !== "boolean") {
        return "Invalid flag";
      }
    }
    if (name === "from" || name === "to") {
      if (selectedActivity && !selectedActivity.is_transfer) {
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
      if (!selectedActivity.name || selectedActivity.name.trim() === "") {
        return "Invalid name";
      }
    }
    return null;
  };

  const allValid = () => {
    return Object.entries(selectedActivity).every(([key, value]) => {
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
        saveActivity(
          account,
          selectedActivity as Activity,
          startDate,
          endDate,
          graphEndDate,
          selectedBillId,
          selectedInterestId,
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
      {selectedActivity ? (
        <>
          <FocusTrap.InitialFocus />
          <Group w="100%">
            {!selectedActivity.date_is_variable && (
              <EditableDateInput
                label="Date"
                value={selectedActivity.date}
                onBlur={(value) => {
                  if (!value) return;
                  dispatch(
                    updateActivity({
                      ...selectedActivity,
                      date: value,
                    }),
                  );
                }}
                placeholder="Date"
              />
            )}
            {selectedActivity.date_is_variable && (
              <Select
                label="Date"
                value={selectedActivity.date_variable as string}
                data={dateVariables.map((v) => ({ label: v, value: v }))}
                onChange={(v) => {
                  if (!v) return;
                  dispatch(
                    updateActivity({
                      ...selectedActivity,
                      date_variable: v,
                    }),
                  );
                }}
                error={validate(
                  "date_variable",
                  selectedActivity.date_variable,
                )}
              />
            )}
            <ActionIcon
              onClick={() => {
                dispatch(
                  updateActivity({
                    ...selectedActivity,
                    date_is_variable: !selectedActivity.date_is_variable,
                  }),
                );
              }}
            >
              {selectedActivity.date_is_variable ? (
                <IconVariable />
              ) : (
                <IconVariableOff />
              )}
            </ActionIcon>
          </Group>
          <CreatableSelect
            label="Name"
            error={validate("name", selectedActivity.name)}
            value={selectedActivity.name}
            onChange={(v: string | null) => {
              const newActivity = {
                ...selectedActivity,
                name: v || "",
              };
              if (!categoryTouched && v && v in names) {
                newActivity.category = names[v];
              }
              dispatch(updateActivity(newActivity));
            }}
            data={Object.entries(names).map(([key, _value]) => ({
              label: key,
              value: key,
            }))}
            clearable
          />
          <Select
            label="Category"
            value={selectedActivity.category}
            data={categories}
            onChange={(v) => {
              dispatch(
                updateActivity({
                  ...selectedActivity,
                  category: v ? v : "",
                }),
              );
              setCategoryTouched(true);
            }}
            searchable
            error={validate("category", selectedActivity.category)}
          />
          <Checkbox
            label="Is this a transfer?"
            checked={selectedActivity.is_transfer}
            onChange={(event) => {
              dispatch(
                updateActivity({
                  ...selectedActivity,
                  is_transfer: event.currentTarget.checked,
                }),
              );
            }}
            error={validate("is_transfer", selectedActivity.is_transfer)}
          />
          {selectedActivity.is_transfer && (
            <>
              <Select
                label="From Account"
                value={selectedActivity.from}
                data={accounts}
                searchable
                placeholder="Select an account"
                onChange={(v) => {
                  dispatch(updateActivity({ ...selectedActivity, from: v }));
                }}
                error={validate("from", selectedActivity.from)}
              />
              <Select
                label="To Account"
                value={selectedActivity.to}
                data={accounts}
                searchable
                placeholder="Select an account"
                onChange={(v) => {
                  dispatch(updateActivity({ ...selectedActivity, to: v }));
                }}
                error={validate("to", selectedActivity.to)}
              />
            </>
          )}
          <Group w="100%">
            {(!selectedActivity.amount_is_variable || selectedActivity.amount_variable === "{HALF}" || selectedActivity.amount_variable === "{FULL}") && (
              <Group w="100%" style={{ flex: 1 }}>
                <NumberInput
                  style={{ flex: 1 }}
                  label="Amount"
                  value={selectedActivity.amount}
                  onChange={(v) => {
                    dispatch(
                      updateActivity({
                        ...selectedActivity,
                        amount: typeof v === "number" ? v : parseFloat(v),
                      }),
                    );
                  }}
                  decimalScale={2}
                  decimalSeparator="."
                  error={validate("amount", selectedActivity.amount)}
                  onKeyDown={handleKeyDown}
                  allowNegative
                />
              </Group>
            ) || (
                <Select
                  label="Amount"
                  value={selectedActivity.amount_variable as string}
                  data={amountVariables.map((v) => ({ label: v, value: v }))}
                  onChange={(v) => {
                    if (!v) return;
                    dispatch(
                      updateActivity({
                        ...selectedActivity,
                        amount_variable: v,
                      }),
                    );
                  }}
                  error={validate(
                    "amount_variable",
                    selectedActivity.amount_variable,
                  )}
                />
              )}
            <ActionIcon
              onClick={() => {
                dispatch(
                  updateActivity({
                    ...selectedActivity,
                    amount_is_variable: !selectedActivity.amount_is_variable,
                  }),
                );
              }}
            >
              {selectedActivity.amount_is_variable ? (
                <IconVariable />
              ) : (
                <IconVariableOff />
              )}
            </ActionIcon>
          </Group>
          <Checkbox
            label="Flag this transaction?"
            checked={selectedActivity.flag}
            onChange={(event) => {
              dispatch(
                updateActivity({
                  ...selectedActivity,
                  flag: event.currentTarget.checked,
                }),
              );
            }}
            error={validate("flag", selectedActivity.flag)}
          />
          <Group w="100%" grow>
            <Button
              disabled={!allValid()}
              onClick={() => {
                dispatch(
                  saveActivity(
                    account,
                    selectedActivity as Activity,
                    startDate,
                    endDate,
                    graphEndDate,
                    selectedBillId,
                    selectedInterestId,
                  ),
                );
                resetSelected();
              }}
            >
              Save
            </Button>
            <Button
              disabled={!selectedActivity.id || !!selectedBillId}
              onClick={() => {
                dispatch(
                  removeActivity(
                    account,
                    activityId as string,
                    selectedActivity.is_transfer,
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
        <Text>No activity selected</Text>
      )}
    </Stack>
  );
};
