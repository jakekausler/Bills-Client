import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEndDate,
  selectNames,
  selectNamesLoaded,
  selectSelectedActivity,
  selectSelectedActivityBillId,
  selectSelectedActivityInterestId,
  selectSelectedActivityLoaded,
  selectStartDate,
} from '../../features/activities/select';
import {
  ActionIcon,
  Button,
  Checkbox,
  FocusTrap,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { AppDispatch } from '../../store';
import { updateActivity } from '../../features/activities/slice';
import { selectCategories, selectCategoriesLoaded } from '../../features/categories/select';
import { selectAccountsLoaded, selectAllAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { removeActivity, saveActivity } from '../../features/activities/actions';
import { Activity } from '../../types/types';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';
import { IconVariable, IconVariableOff, IconWifi0 } from '@tabler/icons-react';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';
import CreatableSelect from '../helpers/creatableSelect';
import { useEffect, useState } from 'react';
import { EditableDateInput } from '../helpers/editableDateInput';
import { CalculatorEditor } from '../helpers/calculatorEditor';
import { FlagSelect } from '../helpers/flagSelect';

export const ActivityEditor = ({ resetSelected }: { resetSelected: () => void }) => {
  const selectedActivity = useSelector(selectSelectedActivity);
  const activityId = selectedActivity?.id;
  const categories = Object.entries(useSelector(selectCategories)).map(([group, items]) => ({
    group,
    items: items.map((item) => ({
      value: `${group}.${item}`,
      label: item,
    })),
  }));
  const accounts = useSelector(selectAllAccounts);

  const [accountList, setAccountList] = useState<{ group: string; items: { value: string; label: string }[] }[]>([]);

  useEffect(() => {
    const accList: { [key: string]: { value: string; label: string }[] } = {};
    for (const account of accounts) {
      if (!(account.type in accList)) {
        accList[account.type] = [];
      }
      accList[account.type].push({
        value: account.name,
        label: account.name,
      });
    }
    setAccountList(
      Object.entries(accList).map(([group, items]) => ({
        group,
        items,
      })),
    );
  }, [accounts]);

  const account = useSelector(selectSelectedAccount);
  const startDate = new Date(useSelector(selectStartDate));
  const endDate = new Date(useSelector(selectEndDate));
  const graphStartDate = new Date(useSelector(selectGraphStartDate));
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
        .filter(([_, value]) => value.type === 'amount')
        .map(([name, _]) => name)
    : [];
  const dateVariables = simulationVariables
    ? Object.entries(simulationVariables)
        .filter(([_, value]) => value.type === 'date')
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

  const theme = useMantineTheme();

  const validate = (name: string, value: string | number | boolean | null) => {
    if (name === 'dateVariable') {
      if (selectedActivity.dateIsVariable) {
        if (!dateVariables.includes(value as string)) {
          return 'Invalid date';
        }
      }
    }
    if (name === 'date') {
      const date = new Date(value as string);
      if (date.toString() === 'Invalid Date') {
        return 'Invalid date';
      }
    }
    if (name === 'amountVariable') {
      if (selectedActivity.amountVariable) {
        if (!amountVariables.includes(value as string) && value !== '{HALF}' && value !== '{FULL}') {
          return 'Invalid amount';
        }
      }
    }
    if (name === 'amount') {
      if (isNaN(value as number) || typeof value === 'boolean') {
        return 'Invalid amount';
      }
    }
    if (name === 'isTransfer') {
      if (typeof value !== 'boolean') {
        return 'Invalid isTransfer';
      }
    }
    if (name === 'flag') {
      if (typeof value !== 'boolean') {
        return 'Invalid flag';
      }
    }
    if (name === 'flagColor') {
      if (value !== null && !theme.colors[value as string]) {
        return 'Invalid flagColor';
      }
    }
    if (name === 'from' || name === 'to') {
      if (selectedActivity && !selectedActivity.isTransfer) {
        return null;
      }
      if (!accountList.find((a) => a.items.find((i) => i.value === value))) {
        return 'Invalid account';
      }
    }
    if (name === 'category') {
      if (!categories.find((c) => !!c.items.find((i) => i.value === value))) {
        return 'Invalid category';
      }
    }
    if (name === 'name') {
      if (!selectedActivity.name || selectedActivity.name.trim() === '') {
        return 'Invalid name';
      }
    }
    return null;
  };

  const allValid = (activity?: Activity) => {
    return Object.entries(activity || selectedActivity).every(([key, value]) => {
      return validate(key, value) === null;
    });
  };

  const getAmount = (activity: Activity) => {
    if (activity.isTransfer) {
      return Math.abs(Number(activity.amount));
    }
    return Number(activity.amount);
  };

  const save = (activity?: Activity) => {
    const activityToSave = {
      ...(activity || (selectedActivity as Activity)),
      amount: getAmount(activity || (selectedActivity as Activity)),
    };
    dispatch(
      saveActivity(
        account,
        activityToSave,
        startDate,
        endDate,
        graphStartDate,
        graphEndDate,
        selectedBillId,
        selectedInterestId,
      ),
    );
    resetSelected();
  };

  const handleEnter = (amount?: number) => {
    if (isNaN(amount as number)) {
      return;
    }
    const activity: Activity = {
      ...selectedActivity,
      amount: amount || selectedActivity.amount,
    } as Activity;
    if (!allValid(activity)) {
      return;
    }
    save(activity);
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
            {!selectedActivity.dateIsVariable && (
              <EditableDateInput
                style={{ flex: 1 }}
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
            {selectedActivity.dateIsVariable && (
              <Select
                style={{ flex: 1 }}
                label="Date"
                value={selectedActivity.dateVariable as string}
                data={dateVariables.map((v) => ({ label: v, value: v }))}
                onChange={(v) => {
                  if (!v) return;
                  dispatch(
                    updateActivity({
                      ...selectedActivity,
                      dateVariable: v,
                    }),
                  );
                }}
                error={validate('dateVariable', selectedActivity.dateVariable)}
              />
            )}
            <ActionIcon
              mt={
                (selectedActivity.dateIsVariable && !validate('dateVariable', selectedActivity.dateVariable)) ||
                (!selectedActivity.dateIsVariable && !validate('date', selectedActivity.date))
                  ? 22
                  : 2
              }
              ml={-12}
              onClick={() => {
                dispatch(
                  updateActivity({
                    ...selectedActivity,
                    dateIsVariable: !selectedActivity.dateIsVariable,
                  }),
                );
              }}
            >
              {selectedActivity.dateIsVariable ? <IconVariable /> : <IconVariableOff />}
            </ActionIcon>
          </Group>
          <CreatableSelect
            label="Name"
            error={validate('name', selectedActivity.name)}
            value={selectedActivity.name}
            onChange={(v: string | null) => {
              const newActivity = {
                ...selectedActivity,
                name: v || '',
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
                  category: v ? v : '',
                }),
              );
              setCategoryTouched(true);
            }}
            searchable
            error={validate('category', selectedActivity.category)}
          />
          <Checkbox
            label="Is this a transfer?"
            checked={selectedActivity.isTransfer}
            onChange={(event) => {
              dispatch(
                updateActivity({
                  ...selectedActivity,
                  isTransfer: event.currentTarget.checked,
                }),
              );
            }}
            error={validate('isTransfer', selectedActivity.isTransfer)}
          />
          {selectedActivity.isTransfer && (
            <>
              <Select
                label="From Account"
                value={selectedActivity.from}
                data={accountList}
                searchable
                placeholder="Select an account"
                onChange={(v) => {
                  dispatch(updateActivity({ ...selectedActivity, from: v }));
                }}
                error={validate('from', selectedActivity.from)}
              />
              <Select
                label="To Account"
                value={selectedActivity.to}
                data={accountList}
                searchable
                placeholder="Select an account"
                onChange={(v) => {
                  dispatch(updateActivity({ ...selectedActivity, to: v }));
                }}
                error={validate('to', selectedActivity.to)}
              />
            </>
          )}
          <Group w="100%">
            {((!selectedActivity.amountIsVariable ||
              selectedActivity.amountVariable === '{HALF}' ||
              selectedActivity.amountVariable === '{FULL}') && (
              <Group w="100%" style={{ flex: 1 }}>
                <CalculatorEditor
                  style={{ flex: 1 }}
                  label="Amount"
                  value={
                    selectedActivity.isTransfer
                      ? Math.abs(Number(selectedActivity.amount))
                      : Number(selectedActivity.amount)
                  }
                  onChange={(v: number) => {
                    dispatch(
                      updateActivity({
                        ...selectedActivity,
                        amount: v,
                      }),
                    );
                  }}
                  error={validate('amount', selectedActivity.amount) || undefined}
                  handleEnter={handleEnter}
                />
              </Group>
            )) || (
              <Select
                style={{ flex: 1 }}
                label="Amount"
                value={selectedActivity.amountVariable as string}
                data={amountVariables.map((v) => ({ label: v, value: v }))}
                onChange={(v) => {
                  if (!v) return;
                  dispatch(
                    updateActivity({
                      ...selectedActivity,
                      amountVariable: v,
                    }),
                  );
                }}
                error={validate('amountVariable', selectedActivity.amountVariable)}
              />
            )}
            <ActionIcon
              mt={
                (selectedActivity.amountIsVariable && !validate('amountVariable', selectedActivity.amountVariable)) ||
                (!selectedActivity.amountIsVariable && !validate('amount', selectedActivity.amount))
                  ? 22
                  : 2
              }
              ml={-12}
              onClick={() => {
                dispatch(
                  updateActivity({
                    ...selectedActivity,
                    amountIsVariable: !selectedActivity.amountIsVariable,
                  }),
                );
              }}
            >
              {selectedActivity.amountIsVariable ? <IconVariable /> : <IconVariableOff />}
            </ActionIcon>
          </Group>
          <FlagSelect
            flagColor={selectedActivity.flagColor}
            onChange={(v: { flagColor: string | null; flag: boolean }) => {
              dispatch(updateActivity({ ...selectedActivity, flagColor: v.flagColor, flag: v.flag }));
            }}
            dropdownProps={{
              zIndex: 1001,
              withinPortal: true,
              position: 'bottom',
            }}
          />
          <Group w="100%" grow>
            <Button
              disabled={!allValid()}
              onClick={() => {
                save();
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
                    selectedActivity.isTransfer,
                    startDate,
                    endDate,
                    graphStartDate,
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
