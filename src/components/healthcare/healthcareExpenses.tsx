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
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getHealthcareExpenses } from '../../features/healthcare/api';
import { HealthcareExpense } from '../../types/types';

interface HealthcareExpensesProps {
  startDate: Date | null;
  endDate: Date | null;
}

export default function HealthcareExpenses({ startDate, endDate }: HealthcareExpensesProps) {
  const selectedSimulation = useSelector(
    (state: RootState) =>
      state.simulations.simulations.find((s) => s.selected)?.name || 'Default'
  );
  const configs = useSelector((state: RootState) => state.healthcare.configs);

  const [expenses, setExpenses] = useState<HealthcareExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPerson, setFilterPerson] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const startDateStr = startDate?.toISOString().split('T')[0];
      const endDateStr = endDate?.toISOString().split('T')[0];
      const data = await getHealthcareExpenses(selectedSimulation, startDateStr, endDateStr);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [selectedSimulation, startDate, endDate]);

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
          <Select
            placeholder="Filter by person"
            data={peopleOptions}
            value={filterPerson}
            onChange={setFilterPerson}
            clearable
            searchable
            style={{ width: 200 }}
          />
        </Group>

        {filteredExpenses.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No healthcare expenses found for this period.
          </Text>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table horizontalSpacing="md" verticalSpacing="sm" striped highlightOnHover>
              <thead>
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>Date</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Name</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Person</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Bill Amount</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Patient Cost</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Copay</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Coinsurance</th>
                  <th style={{ whiteSpace: 'nowrap' }}>HSA Reimbursed</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Account</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Ind. Ded. Left</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Fam. Ded. Left</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Ind. OOP Left</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Fam. OOP Left</th>
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
                    <td style={{ whiteSpace: 'nowrap' }}>{expense.date}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {expense.name}
                      {expense.patientCost === 0 && (
                        <Badge size="xs" color="green" ml="xs">
                          Fully Covered
                        </Badge>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{expense.person}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>${expense.billAmount.toFixed(2)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>${expense.patientCost.toFixed(2)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{expense.copay ? `$${expense.copay.toFixed(2)}` : '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{expense.coinsurance ? `${expense.coinsurance}%` : '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {expense.hsaReimbursed > 0 ? `$${expense.hsaReimbursed.toFixed(2)}` : '-'}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{expense.accountName}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>${expense.individualDeductibleRemaining.toFixed(2)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>${expense.familyDeductibleRemaining.toFixed(2)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>${expense.individualOOPRemaining.toFixed(2)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>${expense.familyOOPRemaining.toFixed(2)}</td>
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
