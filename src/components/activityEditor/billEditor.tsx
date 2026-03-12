import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEndDate,
  selectNames,
  selectNamesLoaded,
  selectSelectedBill,
  selectSelectedBillLoaded,
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
import { selectCategories, selectCategoriesLoaded } from '../../features/categories/select';
import { selectAccountsLoaded, selectAllAccounts, selectSelectedAccount } from '../../features/accounts/select';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';
import { AppDispatch } from '../../store';
import { updateBill } from '../../features/activities/slice';
import { selectSpendingTrackerCategoryOptions } from '../../features/spendingTracker/select';
import { Account, Bill } from '../../types/types';
import { removeBill, saveBill } from '../../features/activities/actions';
import { IconVariable, IconVariableOff } from '@tabler/icons-react';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';
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
  validateBillAmountVariable,
  validateBillAmount,
  validateIsTransfer,
  validateFrom,
  validateTo,
  validateFlag,
  validateFlagColor,
  validateIsHealthcare,
  validateHealthcarePerson,
  validateCoinsurancePercent,
  validateEveryN,
  validatePeriods,
  validateMMDD,
  validateIncreaseBy,
  validateIncreaseByVariable,
  Validator,
  ValidatorContext,
} from './validators';
export const BillEditor = ({ resetSelected }: { resetSelected: () => void }) => {
  const selectedBill = useSelector(selectSelectedBill);
  const billId = selectedBill?.id;
  const categories = Object.entries(useSelector(selectCategories)).map(([group, items]) => ({
    group,
    items: items.map((item) => ({
      value: `${group}.${item}`,
      label: item,
    })),
  }));
  const accounts = useSelector(selectAllAccounts);
  const account = useSelector(selectSelectedAccount);
  const startDate = new Date(useSelector(selectStartDate));
  const endDate = new Date(useSelector(selectEndDate));
  const graphStartDate = new Date(useSelector(selectGraphStartDate));
  const graphEndDate = new Date(useSelector(selectGraphEndDate));
  const billLoaded = useSelector(selectSelectedBillLoaded);
  const accountsLoaded = useSelector(selectAccountsLoaded);
  const categoriesLoaded = useSelector(selectCategoriesLoaded);
  const namesLoaded = useSelector(selectNamesLoaded);

  const dispatch = useDispatch<AppDispatch>();

  const [categoryTouched, setCategoryTouched] = useState(false);
  const names = useSelector(selectNames);

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

  const showLoading = useDelayedLoading(!billLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded);

  const accountList = useGroupedAccounts(accounts);

  const theme = useMantineTheme();

  const billValidators: Record<string, Validator> = {
    name: validateName,
    category: validateCategory,
    startDate: validateDate,
    startDateVariable: (value, ctx) => {
      return validateDateVariable(value, { ...ctx, dateIsVariable: ctx.startDateIsVariable });
    },
    endDate: (value, ctx) => {
      // Empty end dates are valid (optional field)
      if (value === '' || value === undefined || value === null) {
        return null;
      }
      return validateDate(value, ctx);
    },
    endDateVariable: (value, ctx) => {
      // Empty end dates are valid (optional field)
      if (!value) {
        return null;
      }
      return validateDateVariable(value, { ...ctx, dateIsVariable: ctx.endDateIsVariable });
    },
    amount: validateBillAmount,
    amountVariable: validateBillAmountVariable,
    isTransfer: validateIsTransfer,
    from: validateFrom,
    to: validateTo,
    flag: validateFlag,
    flagColor: validateFlagColor,
    isHealthcare: validateIsHealthcare,
    healthcarePerson: validateHealthcarePerson,
    coinsurancePercent: validateCoinsurancePercent,
    everyN: validateEveryN,
    periods: validatePeriods,
    annualStartDate: validateMMDD,
    annualEndDate: validateMMDD,
    increaseBy: validateIncreaseBy,
    increaseByVariable: validateIncreaseByVariable,
    increaseByDate: validateMMDD,
  };

  const validate = (name: string, value: any): string | null => {
    if (!selectedBill) {
      return null;
    }

    const ctx: ValidatorContext = {
      categories,
      accountList,
      amountVariables,
      dateVariables,
      theme,
      isTransfer: selectedBill?.isTransfer,
      isHealthcare: selectedBill?.isHealthcare,
      healthcarePerson: selectedBill?.healthcarePerson,
      amountIsVariable: selectedBill?.amountIsVariable,
      startDateIsVariable: selectedBill?.startDateIsVariable,
      endDateIsVariable: selectedBill?.endDateIsVariable,
      increaseByIsVariable: selectedBill?.increaseByIsVariable,
    };
    return runValidate(billValidators, name, value, ctx);
  };

  const allValid = (bill?: Bill | null) => {
    if (!selectedBill && !bill) {
      return true;
    }
    return bill || selectedBill
      ? Object.entries(bill || (selectedBill as Bill)).every(([key, value]) => {
        return validate(key, value) === null;
      })
      : false;
  };

  const handleEnter = (amount?: number) => {
    if (amount !== undefined && isNaN(amount as number)) {
      return;
    }
    const bill = selectedBill
      ? {
        ...selectedBill,
        amount: amount ?? selectedBill.amount,
      }
      : null;
    if (!allValid(bill)) {
      return;
    }
    dispatch(saveBill(account as Account, bill as Bill, startDate, endDate, graphStartDate, graphEndDate));
    resetSelected();
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
            <Group w="100%" style={{ flex: 1 }}>
              {!selectedBill.startDateIsVariable && (
                <EditableDateInput
                  style={{ flex: 1 }}
                  label="Start date"
                  value={selectedBill.startDate}
                  onBlur={(value) => {
                    if (!value) return;
                    dispatch(
                      updateBill({
                        ...selectedBill,
                        startDate: value,
                      }),
                    );
                  }}
                  placeholder="Start date"
                />
              )}
              {selectedBill.startDateIsVariable && (
                <Select
                  style={{ flex: 1 }}
                  label="Start Date"
                  value={selectedBill.startDateVariable as string}
                  data={dateVariables.map((v) => ({ label: v, value: v }))}
                  onChange={(v) => {
                    if (!v) return;
                    dispatch(
                      updateBill({
                        ...selectedBill,
                        startDateVariable: v,
                      }),
                    );
                  }}
                  error={validate('startDateVariable', selectedBill.startDateVariable)}
                />
              )}
              <ActionIcon
                mt={
                  (selectedBill.startDateIsVariable &&
                    !validate('startDateVariable', selectedBill.startDateVariable)) ||
                    (!selectedBill.startDateIsVariable && !validate('startDate', selectedBill.startDate))
                    ? 22
                    : 2
                }
                ml={-12}
                onClick={() => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      startDateIsVariable: !selectedBill.startDateIsVariable,
                    }),
                  );
                }}
                aria-label="Toggle variable mode for start date"
              >
                {selectedBill.startDateIsVariable ? <IconVariable /> : <IconVariableOff />}
              </ActionIcon>
            </Group>
            <Group w="100%" style={{ flex: 1 }}>
              {!selectedBill.endDateIsVariable && (
                <EditableDateInput
                  style={{ flex: 1 }}
                  label="End date"
                  value={selectedBill.endDate}
                  onBlur={(value) => {
                    dispatch(
                      updateBill({
                        ...selectedBill,
                        endDate: value,
                      }),
                    );
                  }}
                  placeholder="End date"
                  clearable
                />
              )}
              {selectedBill.endDateIsVariable && (
                <Select
                  style={{ flex: 1 }}
                  label="End Date"
                  value={selectedBill.endDateVariable as string}
                  data={dateVariables.map((v) => ({ label: v, value: v }))}
                  onChange={(v) => {
                    if (!v) return;
                    dispatch(
                      updateBill({
                        ...selectedBill,
                        endDateVariable: v,
                      }),
                    );
                  }}
                  error={validate('endDateVariable', selectedBill.endDateVariable)}
                />
              )}
              <ActionIcon
                mt={
                  (selectedBill.endDateIsVariable && !validate('endDateVariable', selectedBill.endDateVariable)) ||
                    (!selectedBill.endDateIsVariable && !validate('endDate', selectedBill.endDate))
                    ? 22
                    : 2
                }
                ml={-12}
                onClick={() => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      endDateIsVariable: !selectedBill.endDateIsVariable,
                    }),
                  );
                }}
                aria-label="Toggle variable mode for end date"
              >
                {selectedBill.endDateIsVariable ? <IconVariable /> : <IconVariableOff />}
              </ActionIcon>
            </Group>
          </Group>
          <CreatableSelect
            label="Name"
            error={validate('name', selectedBill.name)}
            value={selectedBill.name}
            onChange={(v: string | null) => {
              const newBill = {
                ...selectedBill,
                name: v || '',
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
                  category: v ? v : '',
                }),
              );
              setCategoryTouched(true);
            }}
            searchable
            error={validate('category', selectedBill.category)}
          />
          <Checkbox
            label="Healthcare Expense"
            checked={selectedBill.isHealthcare ?? false}
            onChange={(event) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  isHealthcare: event.currentTarget.checked,
                }),
              );
            }}
            error={validate('isHealthcare', selectedBill.isHealthcare)}
          />
          {selectedBill.isHealthcare && (
            <Stack
              gap="sm"
              p="md"
              style={{ backgroundColor: 'var(--mantine-color-body)', borderRadius: 4 }}
              role="region"
              aria-label="Healthcare expense details"
            >
              <TextInput
                label="Person Name"
                value={selectedBill.healthcarePerson || ''}
                onChange={(e) => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      healthcarePerson: e.target.value || null,
                    }),
                  );
                }}
                placeholder="e.g., John, Jane"
                description="Which family member is this expense for?"
                required
                error={validate('healthcarePerson', selectedBill.healthcarePerson)}
              />

              <Group grow>
                <NumberInput
                  label="Copay Amount"
                  value={selectedBill.copayAmount ?? ''}
                  onChange={(v) => {
                    dispatch(
                      updateBill({
                        ...selectedBill,
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
                  value={selectedBill.coinsurancePercent ?? ''}
                  onChange={(v) => {
                    dispatch(
                      updateBill({
                        ...selectedBill,
                        coinsurancePercent: v !== '' && typeof v === 'number' ? v : null,
                      }),
                    );
                  }}
                  placeholder="20"
                  description="Percentage you pay (e.g., 20 for 20%). Used after deductible is met."
                  suffix="%"
                  min={0}
                  error={validate('coinsurancePercent', selectedBill.coinsurancePercent)}
                />
              </Group>

              <Checkbox
                label="Counts toward deductible"
                checked={selectedBill.countsTowardDeductible ?? true}
                onChange={(e) => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      countsTowardDeductible: e.currentTarget.checked,
                    }),
                  );
                }}
                description="Usually yes, except for some preventive care or copays"
              />

              <Checkbox
                label="Counts toward out-of-pocket maximum"
                checked={selectedBill.countsTowardOutOfPocket ?? true}
                onChange={(e) => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      countsTowardOutOfPocket: e.currentTarget.checked,
                    }),
                  );
                }}
                description="Usually yes for all patient costs"
              />
            </Stack>
          )}
          {!selectedBill.isTransfer && (
            <Select
              label="Spending Category"
              data={spendingCategoryOptions}
              value={selectedBill.spendingCategory || ''}
              onChange={(value) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    spendingCategory: value === '' ? null : value,
                  }),
                );
              }}
            />
          )}
          <Checkbox
            label="Is this a transfer?"
            checked={selectedBill.isTransfer}
            onChange={(event) => {
              const checked = event.currentTarget.checked;
              dispatch(
                updateBill({
                  ...selectedBill,
                  isTransfer: checked,
                  ...(checked ? { spendingCategory: null } : {}),
                }),
              );
            }}
            error={validate('isTransfer', selectedBill.isTransfer)}
          />
          {selectedBill.isTransfer && (
            <Stack gap="sm" role="region" aria-label="Transfer details">
              <Select
                label="From Account"
                value={selectedBill.from}
                data={accountList}
                searchable
                placeholder="Select an account"
                onChange={(v) => {
                  dispatch(updateBill({ ...selectedBill, from: v }));
                }}
                error={validate('from', selectedBill.from)}
              />
              <Select
                label="To Account"
                value={selectedBill.to}
                data={accountList}
                searchable
                placeholder="Select an account"
                onChange={(v) => {
                  dispatch(updateBill({ ...selectedBill, to: v }));
                }}
                error={validate('to', selectedBill.to)}
              />
            </Stack>
          )}
          <Group w="100%">
            {!selectedBill.amountIsVariable && (
              <CalculatorEditor
                style={{ flex: 1 }}
                label="Amount"
                value={selectedBill.isTransfer ? Math.abs(Number(selectedBill.amount)) : Number(selectedBill.amount)}
                onChange={(v) => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      amount: typeof v === 'number' ? v : parseFloat(v),
                    }),
                  );
                }}
                error={validate('amount', selectedBill.amount) || undefined}
                handleEnter={handleEnter}
              />
            )}
            {selectedBill.amountIsVariable && (
              <Select
                label="Amount"
                value={selectedBill.amountVariable as string}
                data={amountVariables
                  .map((v) => ({ label: v, value: v }))
                  .concat([
                    { label: '{HALF}', value: '{HALF}' },
                    { label: '{FULL}', value: '{FULL}' },
                    { label: '-{HALF}', value: '-{HALF}' },
                    { label: '-{FULL}', value: '-{FULL}' },
                  ])}
                onChange={(v) => {
                  if (!v) return;
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      amountVariable: v,
                    }),
                  );
                }}
                error={validate('amountVariable', selectedBill.amountVariable)}
              />
            )}
            <ActionIcon
              mt={
                (selectedBill.amountIsVariable && !validate('amountVariable', selectedBill.amountVariable)) ||
                  (!selectedBill.amountIsVariable && !validate('amount', selectedBill.amount))
                  ? 22
                  : 2
              }
              ml={-12}
              onClick={() => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    amountIsVariable: !selectedBill.amountIsVariable,
                  }),
                );
              }}
              aria-label="Toggle variable mode for amount"
            >
              {selectedBill.amountIsVariable ? <IconVariable /> : <IconVariableOff />}
            </ActionIcon>
          </Group>
          <Group grow w="100%">
            <NumberInput
              label="Every N"
              value={selectedBill.everyN}
              onChange={(v) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    everyN: typeof v === 'number' ? v : parseInt(v),
                  }),
                );
              }}
              min={1}
              error={validate('everyN', selectedBill.everyN)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEnter();
                }
              }}
            />
            <Select
              label="Periods"
              value={selectedBill.periods}
              data={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
              onChange={(v) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    periods: v ? v : '',
                  }),
                );
              }}
              searchable
              error={validate('periods', selectedBill.periods)}
            />
          </Group>
          <Group w="100%">
            <TextInput
              style={{ flex: 1 }}
              label="Annual start date"
              value={selectedBill.annualStartDate || ''}
              onChange={(e) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    annualStartDate: e.target.value === '' ? null : e.target.value,
                  }),
                );
              }}
              error={validate('annualStartDate', selectedBill.annualStartDate)}
              placeholder="MM/DD"
            />
            <TextInput
              style={{ flex: 1 }}
              label="Annual end date"
              value={selectedBill.annualEndDate || ''}
              onChange={(e) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    annualEndDate: e.target.value === '' ? null : e.target.value,
                  }),
                );
              }}
              placeholder="MM/DD"
              error={validate('annualEndDate', selectedBill.annualEndDate)}
            />
          </Group>
          <Group w="100%">
            <Group style={{ flex: 1 }} w="100%">
              {!selectedBill.increaseByIsVariable && (
                <CalculatorEditor
                  style={{ flex: 1 }}
                  label="Increase By"
                  value={
                    selectedBill.isTransfer
                      ? Math.abs(Number(selectedBill.increaseBy))
                      : Number(selectedBill.increaseBy)
                  }
                  onChange={(v) => {
                    dispatch(
                      updateBill({
                        ...selectedBill,
                        increaseBy: typeof v === 'number' ? v : parseFloat(v),
                      }),
                    );
                  }}
                  error={validate('increaseBy', selectedBill.increaseBy) || undefined}
                  handleEnter={handleEnter}
                />
              )}
              {selectedBill.increaseByIsVariable && (
                <Select
                  style={{ flex: 1 }}
                  label="Increase By"
                  value={selectedBill.increaseByVariable as string}
                  data={amountVariables.map((v) => ({
                    label: v,
                    value: v,
                  }))}
                  onChange={(v) => {
                    if (!v) return;
                    dispatch(
                      updateBill({
                        ...selectedBill,
                        increaseByVariable: v,
                      }),
                    );
                  }}
                  error={validate('increaseByVariable', selectedBill.increaseByVariable)}
                />
              )}
              <ActionIcon
                mt={
                  (selectedBill.increaseByIsVariable &&
                    !validate('increaseByVariable', selectedBill.increaseByVariable)) ||
                    (!selectedBill.increaseByIsVariable && !validate('increaseBy', selectedBill.increaseBy))
                    ? 22
                    : 2
                }
                ml={-12}
                onClick={() => {
                  dispatch(
                    updateBill({
                      ...selectedBill,
                      increaseByIsVariable: !selectedBill.increaseByIsVariable,
                    }),
                  );
                }}
                aria-label="Toggle variable mode"
              >
                {selectedBill.increaseByIsVariable ? <IconVariable /> : <IconVariableOff />}
              </ActionIcon>
            </Group>
            <TextInput
              style={{ flex: 1 }}
              label="Increase By Date"
              value={selectedBill.increaseByDate}
              onChange={(e) => {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    increaseByDate: e.target.value,
                  }),
                );
              }}
              error={validate('increaseByDate', selectedBill.increaseByDate)}
              placeholder="MM/DD"
            />
          </Group>
          <Group w="100%">
            <FlagSelect
              flagColor={selectedBill.flagColor}
              onChange={(v: { flagColor: string | null; flag: boolean }) => {
                dispatch(updateBill({ ...selectedBill, flagColor: v.flagColor, flag: v.flag }));
              }}
            />
          </Group>
          <Group w="100%" grow>
            {(() => {
              const isValid = allValid();
              return (
                <Button
                  disabled={!isValid}
                  title={!isValid ? 'Fix validation errors before saving' : undefined}
                  onClick={() => {
                    dispatch(
                      saveBill(account as Account, selectedBill as Bill, startDate, endDate, graphStartDate, graphEndDate),
                    );
                    resetSelected();
                  }}
                >
                  Save
                </Button>
              );
            })()}

            <Button
              disabled={!selectedBill.id}
              title={!selectedBill.id ? 'Bill has not been saved yet' : undefined}
              onClick={async () => {
                try {
                  await dispatch(
                    removeBill(
                      account as Account,
                      billId as string,
                      selectedBill.isTransfer,
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
        </>
      ) : (
        <Text>No bill selected</Text>
      )}
    </Stack>
  );
};
