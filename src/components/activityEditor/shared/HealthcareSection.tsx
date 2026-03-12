import React from 'react';
import { Checkbox, Group, NumberInput, Stack, TextInput } from '@mantine/core';

interface HealthcareSectionProps {
  isHealthcare: boolean;
  healthcarePerson: string | null | undefined;
  copayAmount: number | null | undefined;
  coinsurancePercent: number | null | undefined;
  countsTowardDeductible: boolean;
  countsTowardOutOfPocket: boolean;
  onPersonChange: (value: string | null) => void;
  onCopayChange: (value: number | null) => void;
  onCoinsuranceChange: (value: number | null) => void;
  onCountsTowardDeductibleChange: (checked: boolean) => void;
  onCountsTowardOutOfPocketChange: (checked: boolean) => void;
  onIsHealthcareCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validate: (name: string, value: any) => string | null;
  error?: string | null;
}

export const HealthcareSection: React.FC<HealthcareSectionProps> = ({
  isHealthcare,
  healthcarePerson,
  copayAmount,
  coinsurancePercent,
  countsTowardDeductible,
  countsTowardOutOfPocket,
  onPersonChange,
  onCopayChange,
  onCoinsuranceChange,
  onCountsTowardDeductibleChange,
  onCountsTowardOutOfPocketChange,
  onIsHealthcareCheckboxChange,
  validate,
  error,
}) => {
  return (
    <>
      <Checkbox
        label="Healthcare Expense"
        checked={isHealthcare ?? false}
        onChange={onIsHealthcareCheckboxChange}
        error={error}
      />
      {isHealthcare && (
        <Stack
          gap="sm"
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-body)', borderRadius: 4 }}
          role="region"
          aria-label="Healthcare expense details"
        >
          <TextInput
            label="Person Name"
            value={healthcarePerson || ''}
            onChange={(e) => {
              onPersonChange(e.target.value || null);
            }}
            placeholder="e.g., John, Jane"
            description="Which family member is this expense for?"
            required
            error={validate('healthcarePerson', healthcarePerson)}
          />

          <Group grow>
            <NumberInput
              label="Copay Amount"
              value={copayAmount ?? ''}
              onChange={(v) => {
                onCopayChange(v !== '' && typeof v === 'number' ? v : null);
              }}
              placeholder="25.00"
              description="Fixed copay (e.g., $25 for doctor visit). Leave empty if using deductible/coinsurance."
              prefix="$"
              min={0}
              decimalScale={2}
            />

            <NumberInput
              label="Coinsurance Percent"
              value={coinsurancePercent ?? ''}
              onChange={(v) => {
                onCoinsuranceChange(v !== '' && typeof v === 'number' ? v : null);
              }}
              placeholder="20"
              description="Percentage you pay (e.g., 20 for 20%). Used after deductible is met."
              suffix="%"
              min={0}
              error={validate('coinsurancePercent', coinsurancePercent)}
            />
          </Group>

          <Checkbox
            label="Counts toward deductible"
            checked={countsTowardDeductible ?? true}
            onChange={(e) => {
              onCountsTowardDeductibleChange(e.currentTarget.checked);
            }}
            description="Usually yes, except for some preventive care or copays"
          />

          <Checkbox
            label="Counts toward out-of-pocket maximum"
            checked={countsTowardOutOfPocket ?? true}
            onChange={(e) => {
              onCountsTowardOutOfPocketChange(e.currentTarget.checked);
            }}
            description="Usually yes for all patient costs"
          />
        </Stack>
      )}
    </>
  );
};
