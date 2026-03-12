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
import { toDateString } from '../../utils/date';

interface HealthcareExpensesProps {
  startDate: Date | null;
  endDate: Date | null;
}

export default function HealthcareExpenses({ startDate, endDate }: HealthcareExpensesProps) {
  const selectedSimulation = useSelector(
    (state: RootState) =>
      state.simulations.simulations.find((s) => s.selected)?.name || 'Default'
  );
  const [expenses, setExpenses] = useState<HealthcareExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPerson, setFilterPerson] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const startDateStr = startDate ? toDateString(startDate) : undefined;
      const endDateStr = endDate ? toDateString(endDate) : undefined;
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
            aria-label="Filter by person"
            placeholder="Filter by person"
            data={peopleOptions}
            value={filterPerson}
            onChange={setFilterPerson}
            clearable
            searchable
            style={{ width: 200 }}
          />
        </Group>

        <div aria-live="polite">
        {filteredExpenses.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No healthcare expenses found for this period.
          </Text>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table horizontalSpacing="md" verticalSpacing="sm" striped highlightOnHover aria-label="Healthcare expenses">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Date</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Name</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Person</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Bill Amount</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Patient Cost</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Copay</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Coinsurance</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>HSA Reimbursed</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Account</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Ind. Ded. Left</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Fam. Ded. Left</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Ind. OOP Left</Table.Th>
                  <Table.Th scope="col" style={{ whiteSpace: 'nowrap' }}>Fam. OOP Left</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredExpenses.map((expense) => (
                  <Table.Tr
                    key={expense.id}
                    style={{
                      backgroundColor: expense.hsaReimbursed > 0 ? '#e7f5ff' : undefined,
                    }}
                  >
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{expense.date}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>
                      {expense.name}
                      {expense.patientCost === 0 && (
                        <Badge size="xs" color="green" ml="xs">
                          Fully Covered
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{expense.person}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>${(expense.billAmount ?? 0).toFixed(2)}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>${(expense.patientCost ?? 0).toFixed(2)}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{expense.copay ? `$${(expense.copay ?? 0).toFixed(2)}` : '-'}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{expense.coinsurance ? `${expense.coinsurance}%` : '-'}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>
                      {(expense.hsaReimbursed ?? 0) > 0 ? `$${(expense.hsaReimbursed ?? 0).toFixed(2)}` : '-'}
                    </Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{expense.accountName}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>${(expense.individualDeductibleRemaining ?? 0).toFixed(2)}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>${(expense.familyDeductibleRemaining ?? 0).toFixed(2)}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>${(expense.individualOOPRemaining ?? 0).toFixed(2)}</Table.Td>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>${(expense.familyOOPRemaining ?? 0).toFixed(2)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
        </div>

        <Text size="xs" c="dimmed" ta="right">
          Showing {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
        </Text>
      </Stack>
    </Card>
  );
}
