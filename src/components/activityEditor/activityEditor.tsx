import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectSelectedActivity,
  selectSelectedActivityBillId,
  selectSelectedActivityInterestId,
  selectSelectedActivityLoaded,
} from '../../features/activities/select';
import {
  ActionIcon,
  FocusTrap,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { updateActivity } from '../../features/activities/slice';
import { removeActivity, saveActivity } from '../../features/activities/actions';
import { Activity, NameMetadata } from '../../types/types';
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
import { useEditorState } from './useEditorState';
import { useActivityBillState } from './useActivityBillState';

export const ActivityEditor = ({ resetSelected }: { resetSelected: () => void }) => {
  const selectedActivity = useSelector(selectSelectedActivity);
  const activityId = selectedActivity?.id;
  const selectedBillId = useSelector(selectSelectedActivityBillId);
  const selectedInterestId = useSelector(selectSelectedActivityInterestId);
  const activityLoaded = useSelector(selectSelectedActivityLoaded);

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

  const showLoading = useDelayedLoading(!activityLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded);

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
      <NameCategorySection
        name={selectedActivity.name}
        category={selectedActivity.category}
        names={names}
        categories={categories}
        onNameWithMetadataChange={(newName: string, metadata?: NameMetadata) => {
          if (!categoryTouched && metadata) {
            dispatch(
              updateActivity({
                ...selectedActivity,
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
              updateActivity({
                ...selectedActivity,
                name: newName,
              }),
            );
          }
        }}
        onCategoryChange={(category) => {
          dispatch(
            updateActivity({
              ...selectedActivity,
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
        isHealthcare={selectedActivity.isHealthcare ?? false}
        healthcarePerson={selectedActivity.healthcarePerson}
        copayAmount={selectedActivity.copayAmount}
        coinsurancePercent={selectedActivity.coinsurancePercent}
        countsTowardDeductible={selectedActivity.countsTowardDeductible ?? true}
        countsTowardOutOfPocket={selectedActivity.countsTowardOutOfPocket ?? true}
        onPersonChange={(value) => {
          dispatch(
            updateActivity({
              ...selectedActivity,
              healthcarePerson: value,
            }),
          );
        }}
        onCopayChange={(value) => {
          dispatch(
            updateActivity({
              ...selectedActivity,
              copayAmount: value,
            }),
          );
        }}
        onCoinsuranceChange={(value) => {
          dispatch(
            updateActivity({
              ...selectedActivity,
              coinsurancePercent: value,
            }),
          );
        }}
        onCountsTowardDeductibleChange={(checked) => {
          dispatch(
            updateActivity({
              ...selectedActivity,
              countsTowardDeductible: checked,
            }),
          );
        }}
        onCountsTowardOutOfPocketChange={(checked) => {
          dispatch(
            updateActivity({
              ...selectedActivity,
              countsTowardOutOfPocket: checked,
            }),
          );
        }}
        onIsHealthcareCheckboxChange={(event) => {
          dispatch(
            updateActivity({
              ...selectedActivity,
              isHealthcare: event.currentTarget.checked,
            }),
          );
        }}
        validate={validate}
        error={validate('isHealthcare', selectedActivity.isHealthcare)}
      />
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
      <TransferSection
        isTransfer={selectedActivity.isTransfer}
        from={selectedActivity.from}
        to={selectedActivity.to}
        accountList={accountList}
        onIsTransferChange={(event) => {
          const checked = event.currentTarget.checked;
          dispatch(
            updateActivity({
              ...selectedActivity,
              isTransfer: checked,
              ...(checked ? { spendingCategory: null } : {}),
            }),
          );
        }}
        onFromChange={(v) => {
          dispatch(updateActivity({ ...selectedActivity, from: v }));
        }}
        onToChange={(v) => {
          dispatch(updateActivity({ ...selectedActivity, to: v }));
        }}
        validate={validate}
        error={validate('isTransfer', selectedActivity.isTransfer)}
      />
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
      <FlagSection
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
      <SaveDeleteButtons
        allValid={allValid}
        onSave={() => {
          save();
        }}
        onDelete={async () => {
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
        }}
        isNew={!selectedActivity.id}
        itemId={selectedActivity.id}
        disableDelete={!!selectedBillId}
      />
    </Stack>
  );
};
