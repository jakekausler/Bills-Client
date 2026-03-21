import React from 'react';
import {
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  ActionIcon,
  Button,
  Badge,
} from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { Bill, PaycheckProfile, ContributionConfig, EmployerMatchConfig, PaycheckDeduction, BonusConfig, W4Config } from '../../../types/types';

interface PaycheckProfileSectionProps {
  bill: Bill;
  onUpdate: (updates: Partial<Bill>) => void;
  validate: (name: string, value: any) => string | null;
  accountOptions: { group: string; items: { value: string; label: string }[] }[];
}

const frequencyOptions = [
  { label: 'Per Paycheck', value: 'perPaycheck' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' },
];

const contributionTypeOptions = [
  { label: 'Percent', value: 'percent' },
  { label: 'Fixed', value: 'fixed' },
];

const matchModeOptions = [
  { label: 'Simple Percent', value: 'simple' },
  { label: 'Fixed Amount', value: 'fixed' },
  { label: 'Tiered', value: 'tiered' },
];

const deductionTypeOptions = [
  { label: 'Pre-Tax', value: 'preTax' },
  { label: 'Post-Tax', value: 'postTax' },
];

const filingStatusOptions = [
  { label: 'Single', value: 'single' },
  { label: 'Married Filing Jointly', value: 'mfj' },
  { label: 'Married Filing Separately', value: 'mfs' },
  { label: 'Head of Household', value: 'hoh' },
];

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(2024, i).toLocaleString('default', { month: 'long' }),
  value: String(i + 1),
}));

const flattenedAccountOptions = (accountList: { group: string; items: { value: string; label: string }[] }[]) => {
  return accountList.flatMap(group => group.items);
};

export const PaycheckProfileSection: React.FC<PaycheckProfileSectionProps> = ({
  bill,
  onUpdate,
  validate,
  accountOptions,
}) => {
  const paycheckProfile = bill.paycheckProfile;
  const hasPaycheck = !!paycheckProfile;

  const handleTogglePaycheck = (checked: boolean) => {
    if (checked) {
      onUpdate({
        paycheckProfile: {
          grossPay: 0,
        },
      });
    } else {
      onUpdate({ paycheckProfile: null });
    }
  };

  const updateProfile = (updates: Partial<PaycheckProfile>) => {
    if (!paycheckProfile) return;
    onUpdate({
      paycheckProfile: {
        ...paycheckProfile,
        ...updates,
      },
    });
  };

  return (
    <>
      <Checkbox
        label="This is a paycheck"
        checked={hasPaycheck}
        onChange={(e) => handleTogglePaycheck(e.currentTarget.checked)}
      />
      {hasPaycheck && paycheckProfile && (
        <Stack
          gap="sm"
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-body)', borderRadius: 4 }}
          role="region"
          aria-label="Paycheck profile details"
        >
          <NumberInput
            label="Gross Pay"
            value={paycheckProfile.grossPay ?? ''}
            onChange={(v) => {
              updateProfile({ grossPay: typeof v === 'number' ? v : 0 });
            }}
            placeholder="0.00"
            prefix="$"
            min={0}
            decimalScale={2}
            required
            error={validate('paycheckProfile.grossPay', paycheckProfile.grossPay)}
          />

          {/* 401k Section */}
          <Stack gap="xs">
            <Badge size="lg" variant="light">
              401k Contributions
            </Badge>

            {/* Traditional 401k */}
            <Checkbox
              label="Has Traditional 401k"
              checked={!!paycheckProfile.traditional401k}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  updateProfile({
                    traditional401k: {
                      type: 'percent' as const,
                      value: 0,
                      destinationAccount: '',
                      frequency: 'perPaycheck' as const,
                    },
                  });
                } else {
                  updateProfile({ traditional401k: undefined });
                }
              }}
            />
            {paycheckProfile.traditional401k && (
              <ContributionFields
                contribution={paycheckProfile.traditional401k as ContributionConfig}
                onUpdate={(updates) => {
                  updateProfile({ traditional401k: { ...paycheckProfile.traditional401k!, ...updates } as ContributionConfig });
                }}
                accountOptions={accountOptions}
                validate={validate}
              />
            )}

            {/* Roth 401k */}
            <Checkbox
              label="Has Roth 401k"
              checked={!!paycheckProfile.roth401k}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  updateProfile({
                    roth401k: {
                      type: 'percent' as const,
                      value: 0,
                      destinationAccount: '',
                      frequency: 'perPaycheck' as const,
                    },
                  });
                } else {
                  updateProfile({ roth401k: undefined });
                }
              }}
            />
            {paycheckProfile.roth401k && (
              <ContributionFields
                contribution={paycheckProfile.roth401k as ContributionConfig}
                onUpdate={(updates) => {
                  updateProfile({ roth401k: { ...paycheckProfile.roth401k!, ...updates } as ContributionConfig });
                }}
                accountOptions={accountOptions}
                validate={validate}
              />
            )}
          </Stack>

          {/* Employer Match */}
          <Stack gap="xs">
            <Badge size="lg" variant="light">
              Employer Match
            </Badge>

            <Checkbox
              label="Has Employer Match"
              checked={!!paycheckProfile.employerMatch}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  updateProfile({
                    employerMatch: {
                      mode: 'simple' as const,
                      simplePercent: 0,
                      destinationAccount: '',
                    },
                  });
                } else {
                  updateProfile({ employerMatch: undefined });
                }
              }}
            />
            {paycheckProfile.employerMatch && (
              <EmployerMatchFields
                match={paycheckProfile.employerMatch as EmployerMatchConfig}
                onUpdate={(updates) => {
                  updateProfile({ employerMatch: { ...paycheckProfile.employerMatch!, ...updates } as EmployerMatchConfig });
                }}
                accountOptions={accountOptions}
                validate={validate}
              />
            )}
          </Stack>

          {/* HSA */}
          <Stack gap="xs">
            <Badge size="lg" variant="light">
              HSA
            </Badge>

            <Checkbox
              label="Has HSA"
              checked={!!paycheckProfile.hsa}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  updateProfile({
                    hsa: {
                      type: 'fixed' as const,
                      value: 0,
                      destinationAccount: '',
                      frequency: 'perPaycheck' as const,
                    },
                  });
                } else {
                  updateProfile({ hsa: undefined });
                }
              }}
            />
            {paycheckProfile.hsa && (
              <>
                <ContributionFields
                  contribution={paycheckProfile.hsa as ContributionConfig}
                  onUpdate={(updates) => {
                    updateProfile({ hsa: { ...paycheckProfile.hsa!, ...updates } as ContributionConfig });
                  }}
                  accountOptions={accountOptions}
                  validate={validate}
                />
                <NumberInput
                  label="HSA Employer Contribution (Annual)"
                  value={paycheckProfile.hsaEmployerContribution ?? ''}
                  onChange={(v) => {
                    updateProfile({ hsaEmployerContribution: typeof v === 'number' ? v : 0 });
                  }}
                  placeholder="0.00"
                  prefix="$"
                  min={0}
                  decimalScale={2}
                />
              </>
            )}
          </Stack>

          {/* Custom Deductions */}
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Badge size="lg" variant="light">
                Custom Deductions
              </Badge>
              <Button
                size="xs"
                onClick={() => {
                  const deductions = paycheckProfile.deductions ?? [];
                  updateProfile({
                    deductions: [
                      ...deductions,
                      {
                        label: '',
                        amount: 0,
                        type: 'preTax',
                        frequency: 'perPaycheck',
                      },
                    ],
                  });
                }}
                leftSection={<IconPlus size={14} />}
              >
                Add Deduction
              </Button>
            </Group>
            {(paycheckProfile.deductions ?? []).map((deduction, idx) => (
              <DeductionFields
                key={idx}
                deduction={deduction}
                onUpdate={(updates) => {
                  const deductions = [...(paycheckProfile.deductions ?? [])];
                  deductions[idx] = { ...deduction, ...updates };
                  updateProfile({ deductions });
                }}
                onRemove={() => {
                  const deductions = (paycheckProfile.deductions ?? []).filter((_, i) => i !== idx);
                  updateProfile({ deductions: deductions.length > 0 ? deductions : undefined });
                }}
                validate={validate}
                accountOptions={accountOptions}
              />
            ))}
          </Stack>

          {/* Bonus */}
          <Checkbox
            label="Has Bonus"
            checked={!!paycheckProfile.bonus}
            onChange={(e) => {
              if (e.currentTarget.checked) {
                updateProfile({
                  bonus: {
                    percent: 0,
                    month: 12,
                    subjectTo401k: true,
                  } as BonusConfig,
                });
              } else {
                updateProfile({ bonus: undefined });
              }
            }}
          />
          {paycheckProfile.bonus && (
            <BonusFields
              bonus={paycheckProfile.bonus as BonusConfig}
              onUpdate={(updates) => {
                updateProfile({ bonus: { ...paycheckProfile.bonus!, ...updates } as BonusConfig });
              }}
            />
          )}

          {/* W-4 Settings */}
          <Stack gap="xs">
            <Badge size="lg" variant="light">
              W-4 Settings
            </Badge>
            <Select
              label="Filing Status"
              value={paycheckProfile.w4?.filingStatus ?? 'single'}
              data={filingStatusOptions}
              onChange={(value) => {
                if (!value) return;
                const w4 = paycheckProfile.w4 ?? { filingStatus: 'single' };
                updateProfile({
                  w4: {
                    ...w4,
                    filingStatus: value as 'single' | 'mfj' | 'mfs' | 'hoh',
                  },
                });
              }}
            />
            <NumberInput
              label="Extra Withholding"
              value={paycheckProfile.w4?.extraWithholding ?? ''}
              onChange={(v) => {
                const w4 = paycheckProfile.w4 ?? { filingStatus: 'single' };
                updateProfile({
                  w4: {
                    ...w4,
                    extraWithholding: typeof v === 'number' ? v : 0,
                  },
                });
              }}
              placeholder="0.00"
              prefix="$"
              min={0}
              decimalScale={2}
            />
            <Checkbox
              label="Multiple Jobs"
              checked={paycheckProfile.w4?.multipleJobs ?? false}
              onChange={(e) => {
                const w4 = paycheckProfile.w4 ?? { filingStatus: 'single' };
                updateProfile({
                  w4: {
                    ...w4,
                    multipleJobs: e.currentTarget.checked,
                  },
                });
              }}
            />
          </Stack>
        </Stack>
      )}
    </>
  );
};

interface ContributionFieldsProps {
  contribution: ContributionConfig;
  onUpdate: (updates: Partial<ContributionConfig>) => void;
  accountOptions: { group: string; items: { value: string; label: string }[] }[];
  validate: (name: string, value: any) => string | null;
}

const ContributionFields: React.FC<ContributionFieldsProps> = ({ contribution, onUpdate, accountOptions, validate }) => {
  return (
    <Stack gap="sm" pl="lg" style={{ borderLeft: '2px solid var(--mantine-color-gray-3)' }}>
      <Group grow>
        <Select
          label="Type"
          value={contribution.type}
          data={contributionTypeOptions}
          onChange={(value) => {
            if (!value) return;
            onUpdate({ type: value as 'percent' | 'fixed' });
          }}
        />
        <NumberInput
          label={contribution.type === 'percent' ? 'Percent' : 'Amount'}
          value={contribution.value ?? ''}
          onChange={(v) => {
            onUpdate({ value: typeof v === 'number' ? v : 0 });
          }}
          placeholder="0"
          suffix={contribution.type === 'percent' ? '%' : undefined}
          prefix={contribution.type === 'fixed' ? '$' : undefined}
          min={0}
          decimalScale={2}
        />
      </Group>
      <Select
        label="Destination Account"
        value={contribution.destinationAccount || ''}
        data={accountOptions}
        searchable
        placeholder="Select account"
        onChange={(v) => {
          onUpdate({ destinationAccount: v || '' });
        }}
        error={validate('contribution.destinationAccount', contribution.destinationAccount)}
      />
      <Select
        label="Frequency"
        value={contribution.frequency || 'perPaycheck'}
        data={frequencyOptions}
        onChange={(value) => {
          if (!value) return;
          onUpdate({ frequency: value as 'perPaycheck' | 'monthly' | 'annual' });
        }}
      />
    </Stack>
  );
};

interface EmployerMatchFieldsProps {
  match: EmployerMatchConfig;
  onUpdate: (updates: Partial<EmployerMatchConfig>) => void;
  accountOptions: { group: string; items: { value: string; label: string }[] }[];
  validate: (name: string, value: any) => string | null;
}

const EmployerMatchFields: React.FC<EmployerMatchFieldsProps> = ({ match, onUpdate, accountOptions, validate }) => {
  return (
    <Stack gap="sm" pl="lg" style={{ borderLeft: '2px solid var(--mantine-color-gray-3)' }}>
      <Select
        label="Match Mode"
        value={match.mode}
        data={matchModeOptions}
        onChange={(value) => {
          if (!value) return;
          onUpdate({ mode: value as 'simple' | 'tiered' | 'fixed' });
        }}
      />

      {match.mode === 'simple' && (
        <NumberInput
          label="Match Percent"
          value={match.simplePercent ?? ''}
          onChange={(v) => {
            onUpdate({ simplePercent: typeof v === 'number' ? v : 0 });
          }}
          placeholder="0"
          suffix="%"
          min={0}
          decimalScale={2}
        />
      )}

      {match.mode === 'fixed' && (
        <NumberInput
          label="Match Amount"
          value={match.fixedAmount ?? ''}
          onChange={(v) => {
            onUpdate({ fixedAmount: typeof v === 'number' ? v : 0 });
          }}
          placeholder="0.00"
          prefix="$"
          min={0}
          decimalScale={2}
        />
      )}

      {match.mode === 'tiered' && (
        <Stack gap="xs">
          <Stack gap="xs" pl="sm">
            {(match.tiers ?? []).map((tier, idx) => (
              <Group key={idx} grow>
                <NumberInput
                  label="Match %"
                  value={tier.matchPercent ?? ''}
                  onChange={(v) => {
                    const tiers = [...(match.tiers ?? [])];
                    tiers[idx].matchPercent = typeof v === 'number' ? v : 0;
                    onUpdate({ tiers });
                  }}
                  suffix="%"
                  decimalScale={2}
                />
                <NumberInput
                  label="Up to %"
                  value={tier.upToPercent ?? ''}
                  onChange={(v) => {
                    const tiers = [...(match.tiers ?? [])];
                    tiers[idx].upToPercent = typeof v === 'number' ? v : 0;
                    onUpdate({ tiers });
                  }}
                  suffix="%"
                  decimalScale={2}
                />
                <ActionIcon
                  color="red"
                  onClick={() => {
                    const tiers = (match.tiers ?? []).filter((_, i) => i !== idx);
                    onUpdate({ tiers: tiers.length > 0 ? tiers : undefined });
                  }}
                  mt={22}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => {
              const tiers = [...(match.tiers ?? [])];
              tiers.push({ matchPercent: 0, upToPercent: 0 });
              onUpdate({ tiers });
            }}
          >
            Add Tier
          </Button>
        </Stack>
      )}

      <Select
        label="Destination Account"
        value={match.destinationAccount || ''}
        data={accountOptions}
        searchable
        placeholder="Select account"
        onChange={(v) => {
          onUpdate({ destinationAccount: v || '' });
        }}
        error={validate('match.destinationAccount', match.destinationAccount)}
      />
    </Stack>
  );
};

interface DeductionFieldsProps {
  deduction: PaycheckDeduction;
  onUpdate: (updates: Partial<PaycheckDeduction>) => void;
  onRemove: () => void;
  validate: (name: string, value: any) => string | null;
  accountOptions?: { group: string; items: { value: string; label: string }[] }[];
}

const DeductionFields: React.FC<DeductionFieldsProps> = ({ deduction, onUpdate, onRemove, validate, accountOptions }) => {
  return (
    <Stack gap="sm" pl="lg" style={{ borderLeft: '2px solid var(--mantine-color-gray-3)' }}>
      <Group justify="space-between">
        <TextInput
          label="Label"
          value={deduction.label}
          onChange={(e) => {
            onUpdate({ label: e.target.value });
          }}
          placeholder="e.g., Insurance, Gym"
          style={{ flex: 1 }}
        />
        <ActionIcon color="red" onClick={onRemove} mt={22}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      <Group grow>
        <NumberInput
          label="Amount"
          value={deduction.amount ?? ''}
          onChange={(v) => {
            onUpdate({ amount: typeof v === 'number' ? v : 0 });
          }}
          placeholder="0.00"
          prefix="$"
          min={0}
          decimalScale={2}
        />
        <Select
          label="Type"
          value={deduction.type}
          data={deductionTypeOptions}
          onChange={(value) => {
            if (!value) return;
            onUpdate({ type: value as 'preTax' | 'postTax' });
          }}
        />
        <Select
          label="Frequency"
          value={deduction.frequency || 'perPaycheck'}
          data={frequencyOptions}
          onChange={(value) => {
            if (!value) return;
            onUpdate({ frequency: value as 'perPaycheck' | 'monthly' | 'annual' });
          }}
        />
      </Group>
      {accountOptions && (
        <Select
          label="Destination Account"
          value={deduction.destinationAccount || ''}
          data={accountOptions}
          searchable
          placeholder="Select account"
          onChange={(v) => {
            onUpdate({ destinationAccount: v || '' });
          }}
          error={validate('deduction.destinationAccount', deduction.destinationAccount)}
        />
      )}
      <Group>
        <Checkbox
          label="Reduces SS Wages"
          checked={deduction.reducesSSWages ?? false}
          onChange={(e) => {
            onUpdate({ reducesSSWages: e.currentTarget.checked });
          }}
        />
        <Checkbox
          label="Imputed"
          checked={deduction.imputed ?? false}
          onChange={(e) => {
            onUpdate({ imputed: e.currentTarget.checked });
          }}
        />
      </Group>
    </Stack>
  );
};

interface BonusFieldsProps {
  bonus: BonusConfig;
  onUpdate: (updates: Partial<BonusConfig>) => void;
}

const BonusFields: React.FC<BonusFieldsProps> = ({ bonus, onUpdate }) => {
  return (
    <Stack gap="sm" pl="lg" style={{ borderLeft: '2px solid var(--mantine-color-gray-3)' }}>
      <NumberInput
        label="Bonus Percent"
        value={bonus.percent ?? ''}
        onChange={(v) => {
          onUpdate({ percent: typeof v === 'number' ? v : 0 });
        }}
        placeholder="0"
        suffix="%"
        decimalScale={2}
      />
      <Select
        label="Bonus Month"
        value={String(bonus.month || 12)}
        data={monthOptions}
        onChange={(value) => {
          if (!value) return;
          onUpdate({ month: parseInt(value) });
        }}
      />
      <Checkbox
        label="Subject to 401k"
        checked={bonus.subjectTo401k ?? false}
        onChange={(e) => {
          onUpdate({ subjectTo401k: e.currentTarget.checked });
        }}
        description="Bonus amount subject to 401k contributions"
      />
    </Stack>
  );
};
