import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Title,
  Table,
  Select,
  Group,
  Text,
  Loader,
  Alert,
  Badge,
  Stack,
  Button,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getHealthcareExpenses } from '../../features/healthcare/api';
import { HealthcareExpense } from '../../types/types';

export default function HealthcareExpenses() {
  const selectedSimulation = useSelector(
    (state: RootState) =>
      state.simulations.simulations.find((s) => s.selected)?.name || 'Default'
  );
  const configs = useSelector((state: RootState) => state.healthcare.configs);

  const [expenses, setExpenses] = useState<HealthcareExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPerson, setFilterPerson] = useState<string | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(
    new Date(new Date().getFullYear(), 0, 1)
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(
    new Date(new Date().getFullYear(), 11, 31)
  );

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const startDateStr = filterStartDate?.toISOString().split('T')[0];
      const endDateStr = filterEndDate?.toISOString().split('T')[0];
      const data = await getHealthcareExpenses(selectedSimulation, startDateStr, endDateStr);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [selectedSimulation, filterStartDate, filterEndDate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const uniquePeople = [...new Set(expenses.map((e) => e.person))];
  const peopleOptions = uniquePeople.map((p) => ({ value: p, label: p }));

  const filteredExpenses = filterPerson
    ? expenses.filter((e) => e.person === filterPerson)
    : expenses;

  if (loading) {
    return (
      <Card shadow="sm" p="lg">
        <Group justify="center" py="xl">
          <Loader size="sm" />
          <Text c="dimmed">Loading healthcare expenses...</Text>
        </Group>
      </Card>
    );
  }

  const handleRetry = () => {
    fetchExpenses();
  };

  if (error) {
    return (
      <Card shadow="sm" p="lg">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
          <Group mt="md">
            <Button
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={handleRetry}
              variant="light"
            >
              Retry
            </Button>
          </Group>
        </Alert>
      </Card>
    );
  }

  return (
    <Card shadow="sm" p="lg">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Healthcare Expenses</Title>
          <Group>
            <Select
              placeholder="Filter by person"
              data={peopleOptions}
              value={filterPerson}
              onChange={setFilterPerson}
              clearable
              searchable
              style={{ width: 150 }}
            />
            <DateInput
              placeholder="Start date"
              value={filterStartDate}
              onChange={setFilterStartDate}
              clearable
              style={{ width: 150 }}
            />
            <DateInput
              placeholder="End date"
              value={filterEndDate}
              onChange={setFilterEndDate}
              clearable
              style={{ width: 150 }}
            />
          </Group>
        </Group>

        {filteredExpenses.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No healthcare expenses found for this period.
          </Text>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Person</th>
                  <th>Bill Amount</th>
                  <th>Patient Cost</th>
                  <th>Copay</th>
                  <th>Coinsurance</th>
                  <th>HSA Reimbursed</th>
                  <th>Account</th>
                  <th>Ind. Ded. Left</th>
                  <th>Fam. Ded. Left</th>
                  <th>Ind. OOP Left</th>
                  <th>Fam. OOP Left</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    style={{
                      backgroundColor: expense.hsaReimbursed > 0 ? '#e7f5ff' : undefined,
                    }}
                  >
                    <td>{expense.date}</td>
                    <td>
                      {expense.name}
                      {expense.patientCost === 0 && (
                        <Badge size="xs" color="green" ml="xs">
                          Fully Covered
                        </Badge>
                      )}
                    </td>
                    <td>{expense.person}</td>
                    <td>${expense.billAmount.toFixed(2)}</td>
                    <td>${expense.patientCost.toFixed(2)}</td>
                    <td>{expense.copay ? `$${expense.copay.toFixed(2)}` : '-'}</td>
                    <td>{expense.coinsurance ? `${expense.coinsurance}%` : '-'}</td>
                    <td>
                      {expense.hsaReimbursed > 0 ? `$${expense.hsaReimbursed.toFixed(2)}` : '-'}
                    </td>
                    <td>{expense.accountName}</td>
                    <td>${expense.individualDeductibleRemaining.toFixed(2)}</td>
                    <td>${expense.familyDeductibleRemaining.toFixed(2)}</td>
                    <td>${expense.individualOOPRemaining.toFixed(2)}</td>
                    <td>${expense.familyOOPRemaining.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <Text size="xs" c="dimmed" ta="right">
          Showing {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
        </Text>
      </Stack>
    </Card>
  );
}
