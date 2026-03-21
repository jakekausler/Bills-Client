import React, { useState, useEffect } from 'react';
import {
  Stack,
  Paper,
  Text,
  Group,
  NumberInput,
  Alert,
  Loader,
  Card,
  Divider,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { selectSelectedSimulation } from '../../features/monteCarlo/select';
import { toDateString } from '../../utils/date';

interface TaxSummaryData {
  status: string;
  message: string;
  year: number;
  simulationId: string;
  data: null;
}

export default function TaxSummary() {
  const selectedSimulation = useSelector(selectSelectedSimulation);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | undefined>(currentYear);
  const [loading, setLoading] = useState(false);
  const [taxData, setTaxData] = useState<TaxSummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch tax summary data when year changes
  useEffect(() => {
    if (!selectedYear) return;

    const fetchTaxSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `/api/tax-summary?year=${selectedYear}&simulationId=${selectedSimulation || 'default'}`,
          {
            headers: {
              Authorization: token || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch tax summary: ${response.statusText}`);
        }

        const data: TaxSummaryData = await response.json();
        setTaxData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tax summary');
      } finally {
        setLoading(false);
      }
    };

    fetchTaxSummary();
  }, [selectedYear, selectedSimulation]);

  return (
    <Stack gap="lg" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)' }}>
      {/* Year Selector Card */}
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" align="flex-end">
          <div>
            <Text fw={600} mb="xs">
              Tax Summary
            </Text>
            <Text size="sm" c="dimmed">
              View tax reconciliation breakdown for any year
            </Text>
          </div>
          <NumberInput
            label="Year"
            value={selectedYear}
            onChange={(val) => setSelectedYear(val as number)}
            min={2020}
            max={currentYear + 50}
            w={120}
          />
        </Group>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Paper withBorder p="md" radius="md">
          <Group justify="center">
            <Loader size="sm" />
            <Text>Loading tax summary...</Text>
          </Group>
        </Paper>
      )}

      {/* Error State */}
      {error && (
        <Alert icon={<IconAlertCircle />} color="red" title="Error">
          {error}
        </Alert>
      )}

      {/* Data Display */}
      {taxData && !loading && (
        <Stack gap="md">
          {taxData.status === 'not_yet_available' ? (
            <Alert icon={<IconAlertCircle />} color="blue" title="Feature Placeholder">
              <Stack gap="xs">
                <Text size="sm">
                  {taxData.message}
                </Text>
                <Text size="sm" c="dimmed">
                  Year: {taxData.year} | Simulation: {taxData.simulationId}
                </Text>
              </Stack>
            </Alert>
          ) : (
            <>
              {/* Income Section */}
              <Card withBorder p="md" radius="md">
                <Card.Section withBorder inheritPadding py="md">
                  <Text fw={600} size="lg">
                    Income
                  </Text>
                </Card.Section>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Income data will be displayed here
                  </Text>
                </Stack>
              </Card>

              {/* AGI Section */}
              <Card withBorder p="md" radius="md">
                <Card.Section withBorder inheritPadding py="md">
                  <Text fw={600} size="lg">
                    Adjusted Gross Income (AGI)
                  </Text>
                </Card.Section>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    AGI data will be displayed here
                  </Text>
                </Stack>
              </Card>

              {/* Deductions Section */}
              <Card withBorder p="md" radius="md">
                <Card.Section withBorder inheritPadding py="md">
                  <Text fw={600} size="lg">
                    Deductions
                  </Text>
                </Card.Section>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Deduction data will be displayed here
                  </Text>
                </Stack>
              </Card>

              {/* Tax Section */}
              <Card withBorder p="md" radius="md">
                <Card.Section withBorder inheritPadding py="md">
                  <Text fw={600} size="lg">
                    Tax Calculation
                  </Text>
                </Card.Section>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Tax calculation data will be displayed here
                  </Text>
                </Stack>
              </Card>

              {/* Withholding Section */}
              <Card withBorder p="md" radius="md">
                <Card.Section withBorder inheritPadding py="md">
                  <Text fw={600} size="lg">
                    Withholding & Settlement
                  </Text>
                </Card.Section>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Withholding and settlement data will be displayed here
                  </Text>
                </Stack>
              </Card>
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
}
