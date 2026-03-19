import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectSelectedBill,
  selectSelectedBillLoaded,
} from '../../features/activities/select';
import {
  ActionIcon,
  FocusTrap,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { Account, Bill, NameMetadata } from '../../types/types';
import { updateBill } from '../../features/activities/slice';
import { removeBill, saveBill } from '../../features/activities/actions';
import { IconVariable, IconVariableOff } from '@tabler/icons-react';
import CreatableSelect from '../helpers/creatableSelect';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { EditableDateInput } from '../helpers/editableDateInput';
import { CalculatorEditor } from '../helpers/calculatorEditor';
import { FlagSelect } from '../helpers/flagSelect';
import { HealthcareSection } from './shared/HealthcareSection';
import { TransferSection } from './shared/TransferSection';
import { FlagSection } from './shared/FlagSection';
import { NameCategorySection } from './shared/NameCategorySection';
import { SaveDeleteButtons } from './shared/SaveDeleteButtons';
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
import { useEditorState } from './useEditorState';
import { useActivityBillState } from './useActivityBillState';
export const BillEditor = ({ resetSelected }: { resetSelected: () => void }) => {
  const selectedBill = useSelector(selectSelectedBill);
  const billId = selectedBill?.id;
  const billLoaded = useSelector(selectSelectedBillLoaded);

  const {
    dispatch,
    account,
    startDate,
    endDate,
    graphStartDate,
    graphEndDate,
    accountsLoaded,
    categoriesLoaded,
    amountVariables,
    dateVariables,
  } = useEditorState();

  const {
    theme,
    categories,
    accountList,
    names,
    namesLoaded,
    categoryTouched,
    setCategoryTouched,
    spendingCategoryOptions,
  } = useActivityBillState();

  const showLoading = useDelayedLoading(!billLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded);

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

  // DEBUG: Log validation errors when bill editor opens with existing data
  useEffect(() => {
    if (!selectedBill) return;
    const errors: Record<string, string> = {};
    Object.entries(selectedBill).forEach(([key, value]) => {
      const error = validate(key, value);
      if (error !== null) {
        errors[key] = error;
      }
    });
    if (Object.keys(errors).length > 0) {
      console.log('[BillEditor] Opened with validation errors:', errors);
      console.log('[BillEditor] Bill data:', JSON.stringify(selectedBill, null, 2));
    } else {
      console.log('[BillEditor] Opened with no validation errors');
    }
  }, [billId]); // Re-run when a different bill is selected

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
          <NameCategorySection
            name={selectedBill.name}
            category={selectedBill.category}
            names={names}
            categories={categories}
            onNameWithMetadataChange={(newName: string, metadata?: NameMetadata) => {
              if (!categoryTouched && metadata) {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    name: newName,
                    category: metadata.category,
                    isHealthcare: metadata.isHealthcare,
                    healthcarePerson: metadata.healthcarePerson,
                    coinsurancePercent: metadata.coinsurancePercent,
                    isTransfer: metadata.isTransfer,
                    from: metadata.from,
                    to: metadata.to,
                    spendingCategory: metadata.spendingCategory,
                  }),
                );
              } else {
                dispatch(
                  updateBill({
                    ...selectedBill,
                    name: newName,
                  }),
                );
              }
            }}
            onCategoryChange={(category) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  category,
                }),
              );
              setCategoryTouched(true);
            }}
            validate={validate}
            categoryTouched={categoryTouched}
            setCategoryTouched={setCategoryTouched}
          />
          <HealthcareSection
            isHealthcare={selectedBill.isHealthcare ?? false}
            healthcarePerson={selectedBill.healthcarePerson}
            copayAmount={selectedBill.copayAmount}
            coinsurancePercent={selectedBill.coinsurancePercent}
            countsTowardDeductible={selectedBill.countsTowardDeductible ?? true}
            countsTowardOutOfPocket={selectedBill.countsTowardOutOfPocket ?? true}
            onPersonChange={(value) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  healthcarePerson: value,
                }),
              );
            }}
            onCopayChange={(value) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  copayAmount: value,
                }),
              );
            }}
            onCoinsuranceChange={(value) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  coinsurancePercent: value,
                }),
              );
            }}
            onCountsTowardDeductibleChange={(checked) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  countsTowardDeductible: checked,
                }),
              );
            }}
            onCountsTowardOutOfPocketChange={(checked) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  countsTowardOutOfPocket: checked,
                }),
              );
            }}
            onIsHealthcareCheckboxChange={(event) => {
              dispatch(
                updateBill({
                  ...selectedBill,
                  isHealthcare: event.currentTarget.checked,
                }),
              );
            }}
            validate={validate}
            error={validate('isHealthcare', selectedBill.isHealthcare)}
          />
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
          <TransferSection
            isTransfer={selectedBill.isTransfer}
            from={selectedBill.from}
            to={selectedBill.to}
            accountList={accountList}
            onIsTransferChange={(event) => {
              const checked = event.currentTarget.checked;
              dispatch(
                updateBill({
                  ...selectedBill,
                  isTransfer: checked,
                  ...(checked ? { spendingCategory: null } : {}),
                }),
              );
            }}
            onFromChange={(v) => {
              dispatch(updateBill({ ...selectedBill, from: v }));
            }}
            onToChange={(v) => {
              dispatch(updateBill({ ...selectedBill, to: v }));
            }}
            validate={validate}
            error={validate('isTransfer', selectedBill.isTransfer)}
          />
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
          <FlagSection
            flagColor={selectedBill.flagColor}
            onChange={(v: { flagColor: string | null; flag: boolean }) => {
              dispatch(updateBill({ ...selectedBill, flagColor: v.flagColor, flag: v.flag }));
            }}
          />
          <SaveDeleteButtons
            allValid={allValid}
            onSave={() => {
              dispatch(
                saveBill(account as Account, selectedBill as Bill, startDate, endDate, graphStartDate, graphEndDate),
              );
              resetSelected();
            }}
            onDelete={async () => {
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
            }}
            isNew={!selectedBill.id}
            itemId={selectedBill.id}
          />
        </>
      ) : (
        <Text>No bill selected</Text>
      )}
    </Stack>
  );
};
