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
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { AppDispatch } from '../../store';
import { updateActivity } from '../../features/activities/slice';
import { selectCategories, selectCategoriesLoaded } from '../../features/categories/select';
import { selectAccountsLoaded, selectAllAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { removeActivity, saveActivity } from '../../features/activities/actions';
import { Activity } from '../../types/types';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';
import { IconVariable, IconVariableOff } from '@tabler/icons-react';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';
import { selectSpendingTrackerCategoryOptions } from '../../features/spendingTracker/select';
import CreatableSelect from '../helpers/creatableSelect';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { useGroupedAccounts } from '../../hooks/useGroupedAccounts';
import { useState } from 'react';
import { EditableDateInput } from '../helpers/editableDateInput';
import { CalculatorEditor } from '../helpers/calculatorEditor';
import { FlagSelect } from '../helpers/flagSelect';
import {
  runValidate,
  validateName,
  validateCategory,
  validateDate,
  validateDateVariable,
  validateAmountVariable,
  validateNumber,
  validateIsTransfer,
  validateFrom,
  validateTo,
  validateFlag,
  validateFlagColor,
  validateIsHealthcare,
  validateHealthcarePerson,
  validateCoinsurancePercent,
  Validator,
  ValidatorContext,
} from './validators';

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

  const accountList = useGroupedAccounts(accounts);

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

  const spendingCategoryOptions = useSelector(selectSpendingTrackerCategoryOptions);
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

  const showLoading = useDelayedLoading(!activityLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded);
  const theme = useMantineTheme();

  if (!account) {
    return <Text>No account selected</Text>;
  }

  if (!selectedActivity) {
    return <Text>No activity selected</Text>;
  }

  const activityValidators: Record<string, Validator> = {
    name: validateName,
    category: validateCategory,
    date: validateDate,
    dateVariable: validateDateVariable,
    amount: validateNumber,
    amountVariable: validateAmountVariable,
    isTransfer: validateIsTransfer,
    from: validateFrom,
    to: validateTo,
    flag: validateFlag,
    flagColor: validateFlagColor,
    isHealthcare: validateIsHealthcare,
    healthcarePerson: validateHealthcarePerson,
    coinsurancePercent: validateCoinsurancePercent,
  };

  const validate = (name: string, value: string | number | boolean | null | undefined): string | null => {
    const ctx: ValidatorContext = {
      categories,
      accountList,
      amountVariables,
      dateVariables,
      theme,
      isTransfer: selectedActivity?.isTransfer,
      isHealthcare: selectedActivity?.isHealthcare,
      healthcarePerson: selectedActivity?.healthcarePerson,
      amountIsVariable: selectedActivity?.amountIsVariable,
      dateIsVariable: selectedActivity?.dateIsVariable,
    };
    return runValidate(activityValidators, name, value, ctx);
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
      amount: amount ?? selectedActivity.amount,
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
          aria-label="Toggle variable mode for date"
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
        label="Healthcare Expense"
        checked={selectedActivity.isHealthcare ?? false}
        onChange={(event) => {
          dispatch(
            updateActivity({
              ...selectedActivity,
              isHealthcare: event.currentTarget.checked,
            }),
          );
        }}
        error={validate('isHealthcare', selectedActivity.isHealthcare)}
      />
      {selectedActivity.isHealthcare && (
        <Stack
          gap="sm"
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-body)', borderRadius: 4 }}
          role="region"
          aria-label="Healthcare expense details"
        >
          <TextInput
            label="Person Name"
            value={selectedActivity.healthcarePerson || ''}
            onChange={(e) => {
              dispatch(
                updateActivity({
                  ...selectedActivity,
                  healthcarePerson: e.target.value || null,
                }),
              );
            }}
            placeholder="e.g., John, Jane"
            description="Which family member is this expense for?"
            required
            error={validate('healthcarePerson', selectedActivity.healthcarePerson)}
          />

          <Group grow>
            <NumberInput
              label="Copay Amount"
              value={selectedActivity.copayAmount ?? ''}
              onChange={(v) => {
                dispatch(
                  updateActivity({
                    ...selectedActivity,
                    copayAmount: v !== '' && typeof v === 'number' ? v : null,
                  }),
                );
              }}
              placeholder="25.00"
              description="Fixed copay (e.g., $25 for doctor visit). Leave empty if using deductible/coinsurance."
              prefix="$"
              min={0}
              decimalScale={2}
            />

            <NumberInput
              label="Coinsurance Percent"
              value={selectedActivity.coinsurancePercent ?? ''}
              onChange={(v) => {
                dispatch(
                  updateActivity({
                    ...selectedActivity,
                    coinsurancePercent: v !== '' && typeof v === 'number' ? v : null,
                  }),
                );
              }}
              placeholder="20"
              description="Percentage you pay (e.g., 20 for 20%). Used after deductible is met."
              suffix="%"
              min={0}
              error={validate('coinsurancePercent', selectedActivity.coinsurancePercent)}
            />
          </Group>

          <Checkbox
            label="Counts toward deductible"
            checked={selectedActivity.countsTowardDeductible ?? true}
            onChange={(e) => {
              dispatch(
                updateActivity({
                  ...selectedActivity,
                  countsTowardDeductible: e.currentTarget.checked,
                }),
              );
            }}
            description="Usually yes, except for some preventive care or copays"
          />

          <Checkbox
            label="Counts toward out-of-pocket maximum"
            checked={selectedActivity.countsTowardOutOfPocket ?? true}
            onChange={(e) => {
              dispatch(
                updateActivity({
                  ...selectedActivity,
                  countsTowardOutOfPocket: e.currentTarget.checked,
                }),
              );
            }}
            description="Usually yes for all patient costs"
          />
        </Stack>
      )}
      {!selectedActivity.isTransfer && (
        <Select
          label="Spending Category"
          data={spendingCategoryOptions}
          value={selectedActivity.spendingCategory || ''}
          onChange={(value) => {
            dispatch(
              updateActivity({
                ...selectedActivity,
                spendingCategory: value === '' ? null : value,
              }),
            );
          }}
        />
      )}
      <Checkbox
        label="Is this a transfer?"
        checked={selectedActivity.isTransfer}
        onChange={(event) => {
          const checked = event.currentTarget.checked;
          dispatch(
            updateActivity({
              ...selectedActivity,
              isTransfer: checked,
              ...(checked ? { spendingCategory: null } : {}),
            }),
          );
        }}
        error={validate('isTransfer', selectedActivity.isTransfer)}
      />
      {selectedActivity.isTransfer && (
        <Stack gap="sm" role="region" aria-label="Transfer details">
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
        </Stack>
      )}
      <Group w="100%">
        {(!selectedActivity.amountIsVariable ||
          selectedActivity.amountVariable === '{HALF}' ||
          selectedActivity.amountVariable === '{FULL}') ? (
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
        ) : (
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
          aria-label="Toggle variable mode for amount"
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
        {(() => {
          const isValid = allValid();
          return (
            <Button
              disabled={!isValid}
              title={!isValid ? 'Fix validation errors before saving' : undefined}
              onClick={() => {
                save();
              }}
            >
              Save
            </Button>
          );
        })()}

        <Button
          disabled={!selectedActivity.id || !!selectedBillId}
          title={!selectedActivity.id ? 'Activity has not been saved yet' : selectedBillId ? 'Cannot remove an activity linked to a bill' : undefined}
          onClick={async () => {
            try {
              await dispatch(
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
            } catch {
              // error already dispatched
            }
          }}
        >
          Remove
        </Button>
      </Group>
    </Stack>
  );
};
