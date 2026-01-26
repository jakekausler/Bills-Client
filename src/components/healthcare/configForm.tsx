import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Button,
  Group,
  Tabs,
  Stack,
  Text,
  Alert,
  MultiSelect,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconAlertCircle } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createHealthcareConfig, updateHealthcareConfig } from '../../features/healthcare/actions';
import { HealthcareConfig } from '../../types/types';

type ConfigFormProps = {
  opened: boolean;
  onClose: () => void;
  config: HealthcareConfig | null;
};

const MONTHS = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export default function ConfigForm({ opened, onClose, config }: ConfigFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const activities = useSelector((state: RootState) => state.activities.activities);
  const calendarBills = useSelector((state: RootState) => state.calendar.bills);

  const isEdit = config !== null;

  const [name, setName] = useState('');
  const [coveredPersons, setCoveredPersons] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [individualDeductible, setIndividualDeductible] = useState<number | ''>('');
  const [individualOutOfPocketMax, setIndividualOutOfPocketMax] = useState<number | ''>('');
  const [familyDeductible, setFamilyDeductible] = useState<number | ''>('');
  const [familyOutOfPocketMax, setFamilyOutOfPocketMax] = useState<number | ''>('');
  const [hsaAccountId, setHsaAccountId] = useState<string | null>(null);
  const [hsaReimbursementEnabled, setHsaReimbursementEnabled] = useState(true);
  const [resetMonth, setResetMonth] = useState('0');
  const [resetDay, setResetDay] = useState<number | ''>(1);
  const [error, setError] = useState<string | null>(null);

  // Collect existing person names from healthcare bills and activities
  const existingPersons = useMemo(() => {
    const persons = new Set<string>();

    // Collect from activities
    activities.forEach((activity) => {
      if (activity.isHealthcare && activity.healthcarePerson) {
        persons.add(activity.healthcarePerson);
      }
    });

    // Collect from calendar bills
    calendarBills.forEach((bill) => {
      if (bill.isHealthcare && bill.healthcarePerson) {
        persons.add(bill.healthcarePerson);
      }
    });

    return Array.from(persons).sort();
  }, [activities, calendarBills]);

  useEffect(() => {
    if (config) {
      setName(config.name);
      setCoveredPersons(config.coveredPersons || []);
      setStartDate(new Date(config.startDate));
      setEndDate(config.endDate ? new Date(config.endDate) : null);
      setIndividualDeductible(config.individualDeductible);
      setIndividualOutOfPocketMax(config.individualOutOfPocketMax);
      setFamilyDeductible(config.familyDeductible);
      setFamilyOutOfPocketMax(config.familyOutOfPocketMax);
      setHsaAccountId(config.hsaAccountId);
      setHsaReimbursementEnabled(config.hsaReimbursementEnabled);
      setResetMonth(config.resetMonth.toString());
      setResetDay(config.resetDay);
    } else {
      resetForm();
    }
  }, [config, opened]);

  const resetForm = () => {
    setName('');
    setCoveredPersons([]);
    setStartDate(null);
    setEndDate(null);
    setIndividualDeductible('');
    setIndividualOutOfPocketMax('');
    setFamilyDeductible('');
    setFamilyOutOfPocketMax('');
    setHsaAccountId(null);
    setHsaReimbursementEnabled(true);
    setResetMonth('0');
    setResetDay(1);
    setError(null);
  };

  const handleSave = async () => {
    if (!startDate || !name || coveredPersons.length === 0) return;

    // Clear any previous errors
    setError(null);

    const configData: Omit<HealthcareConfig, 'id'> = {
      name,
      coveredPersons,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
      individualDeductible: Number(individualDeductible),
      individualOutOfPocketMax: Number(individualOutOfPocketMax),
      familyDeductible: Number(familyDeductible),
      familyOutOfPocketMax: Number(familyOutOfPocketMax),
      hsaAccountId,
      hsaReimbursementEnabled,
      resetMonth: Number(resetMonth),
      resetDay: Number(resetDay),
    };

    try {
      if (isEdit && config) {
        await dispatch(updateHealthcareConfig(config.id, { ...configData, id: config.id }));
      } else {
        await dispatch(createHealthcareConfig(configData));
      }
      onClose();
    } catch (error) {
      console.error('Failed to save config:', error);
      setError(
        error instanceof Error
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} healthcare configuration. Please try again.`
      );
    }
  };

  const hsaAccounts = accounts
    .filter((a) => a.type === 'HSA')
    .map((a) => ({ value: a.id, label: a.name }));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? 'Edit Healthcare Configuration' : 'New Healthcare Configuration'}
      size="lg"
    >
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mb="md"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
          <Tabs.Tab value="thresholds">Deductibles & OOP</Tabs.Tab>
          <Tabs.Tab value="hsa">HSA Settings</Tabs.Tab>
          <Tabs.Tab value="reset">Plan Year Reset</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="basic" pt="md">
          <Stack gap="sm">
            <TextInput
              label="Plan Name"
              placeholder="e.g., Blue Cross PPO 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <MultiSelect
              label="Covered Persons"
              placeholder="Select or add person names"
              data={existingPersons}
              value={coveredPersons}
              onChange={setCoveredPersons}
              searchable
              required
            />
            <DateInput
              label="Start Date"
              placeholder="When does this plan start?"
              value={startDate}
              onChange={setStartDate}
              required
            />
            <DateInput
              label="End Date"
              placeholder="Leave empty if ongoing"
              value={endDate}
              onChange={setEndDate}
              clearable
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="thresholds" pt="md">
          <Stack gap="sm">
            <NumberInput
              label="Individual Deductible"
              placeholder="e.g., 1500"
              value={individualDeductible}
              onChange={(val) => setIndividualDeductible(val === '' ? '' : Number(val))}
              prefix="$"
              min={0}
              required
            />
            <NumberInput
              label="Family Deductible"
              placeholder="e.g., 3000"
              value={familyDeductible}
              onChange={(val) => setFamilyDeductible(val === '' ? '' : Number(val))}
              prefix="$"
              min={0}
              required
            />
            <NumberInput
              label="Individual Out-of-Pocket Max"
              placeholder="e.g., 5000"
              value={individualOutOfPocketMax}
              onChange={(val) => setIndividualOutOfPocketMax(val === '' ? '' : Number(val))}
              prefix="$"
              min={0}
              required
            />
            <NumberInput
              label="Family Out-of-Pocket Max"
              placeholder="e.g., 10000"
              value={familyOutOfPocketMax}
              onChange={(val) => setFamilyOutOfPocketMax(val === '' ? '' : Number(val))}
              prefix="$"
              min={0}
              required
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="hsa" pt="md">
          <Stack gap="sm">
            <Select
              label="HSA Account"
              placeholder="Select HSA account for reimbursements"
              data={hsaAccounts}
              value={hsaAccountId}
              onChange={setHsaAccountId}
              clearable
              searchable
            />
            <Checkbox
              label="Enable automatic HSA reimbursement"
              checked={hsaReimbursementEnabled}
              onChange={(e) => setHsaReimbursementEnabled(e.currentTarget.checked)}
              description="Automatically reimburse healthcare expenses from HSA"
            />
            {hsaAccounts.length === 0 && (
              <Text size="sm" c="dimmed">
                No HSA accounts found. Create an HSA account first.
              </Text>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="reset" pt="md">
          <Stack gap="sm">
            <Select
              label="Reset Month"
              placeholder="Select month"
              data={MONTHS}
              value={resetMonth}
              onChange={(val) => setResetMonth(val || '0')}
              required
            />
            <NumberInput
              label="Reset Day"
              placeholder="e.g., 1"
              value={resetDay}
              onChange={(val) => setResetDay(val === '' ? '' : Number(val))}
              min={1}
              max={31}
              required
            />
            <Text size="sm" c="dimmed">
              When your deductible and out-of-pocket maximum reset each year
            </Text>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!name || coveredPersons.length === 0 || !startDate}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Group>
    </Modal>
  );
}
