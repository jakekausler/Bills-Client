import React, { useState, useEffect, useCallback } from 'react';
import { Card, Title, Stack, Progress, Text, Group, Loader, Alert, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getDeductibleProgress } from '../../features/healthcare/api';
import { selectHealthcareConfigs } from '../../features/healthcare/select';
import { DeductibleProgress as DeductibleProgressType } from '../../types/types';

export default function DeductibleProgress() {
  const selectedSimulation = useSelector(
    (state: RootState) =>
      state.simulations.simulations.find((s) => s.selected)?.name || 'Default'
  );
  const configs = useSelector(selectHealthcareConfigs);
  const [progressData, setProgressData] = useState<Record<string, DeductibleProgressType>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Pass end of current calendar year to get progress for the active plan year
      // For mid-year resets (e.g., July 1), this ensures we see the current plan year
      const currentYearEnd = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
      const data = await getDeductibleProgress(selectedSimulation, currentYearEnd);
      setProgressData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [selectedSimulation]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress, configs]);

  const getColor = (spent: number, total: number) => {
    const percent = (spent / total) * 100;
    if (percent < 25) return 'red';
    if (percent < 75) return 'yellow';
    return 'green';
  };

  const getPercent = (spent: number, total: number) => {
    if (total === 0) return '0';
    return ((spent / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <Card shadow="sm" p="lg">
        <Group justify="center" py="xl">
          <Loader size="sm" />
          <Text c="dimmed">Loading deductible progress...</Text>
        </Group>
      </Card>
    );
  }

  const handleRetry = () => {
    fetchProgress();
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

  const people = Object.keys(progressData);

  if (people.length === 0) {
    return (
      <Card shadow="sm" p="lg">
        <Text c="dimmed" ta="center" py="xl">
          No active healthcare configurations with expenses found.
        </Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" p="lg">
      <Title order={3} mb="md">
        Deductible Progress - {progressData[people[0]]?.planYear}
      </Title>

      <Stack gap="lg">
        {people.map((person) => {
          const progress = progressData[person];
          return (
            <Card key={person} withBorder p="md">
              <Text fw={700} mb="sm">
                {person} - {progress.configName}
              </Text>

              <Stack gap="sm">
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">Individual Deductible</Text>
                    <Text size="sm" fw={500}>
                      ${progress.individualDeductibleSpent} / $
                      {progress.individualDeductibleSpent + progress.individualDeductibleRemaining}
                      {' '}({getPercent(
                        progress.individualDeductibleSpent,
                        progress.individualDeductibleSpent + progress.individualDeductibleRemaining
                      )}%)
                      {progress.individualDeductibleMet && ' ✓'}
                    </Text>
                  </Group>
                  <Progress
                    value={
                      (progress.individualDeductibleSpent /
                        (progress.individualDeductibleSpent +
                          progress.individualDeductibleRemaining)) *
                      100
                    }
                    color={getColor(
                      progress.individualDeductibleSpent,
                      progress.individualDeductibleSpent + progress.individualDeductibleRemaining
                    )}
                    size="lg"
                  />
                </div>

                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">Family Deductible</Text>
                    <Text size="sm" fw={500}>
                      ${progress.familyDeductibleSpent} / $
                      {progress.familyDeductibleSpent + progress.familyDeductibleRemaining}
                      {' '}({getPercent(
                        progress.familyDeductibleSpent,
                        progress.familyDeductibleSpent + progress.familyDeductibleRemaining
                      )}%)
                      {progress.familyDeductibleMet && ' ✓'}
                    </Text>
                  </Group>
                  <Progress
                    value={
                      (progress.familyDeductibleSpent /
                        (progress.familyDeductibleSpent + progress.familyDeductibleRemaining)) *
                      100
                    }
                    color={getColor(
                      progress.familyDeductibleSpent,
                      progress.familyDeductibleSpent + progress.familyDeductibleRemaining
                    )}
                    size="lg"
                  />
                </div>

                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">Individual Out-of-Pocket Max</Text>
                    <Text size="sm" fw={500}>
                      ${progress.individualOOPSpent} / $
                      {progress.individualOOPSpent + progress.individualOOPRemaining}
                      {' '}({getPercent(
                        progress.individualOOPSpent,
                        progress.individualOOPSpent + progress.individualOOPRemaining
                      )}%)
                      {progress.individualOOPMet && ' ✓'}
                    </Text>
                  </Group>
                  <Progress
                    value={
                      (progress.individualOOPSpent /
                        (progress.individualOOPSpent + progress.individualOOPRemaining)) *
                      100
                    }
                    color={getColor(
                      progress.individualOOPSpent,
                      progress.individualOOPSpent + progress.individualOOPRemaining
                    )}
                    size="lg"
                  />
                </div>

                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">Family Out-of-Pocket Max</Text>
                    <Text size="sm" fw={500}>
                      ${progress.familyOOPSpent} / $
                      {progress.familyOOPSpent + progress.familyOOPRemaining}
                      {' '}({getPercent(
                        progress.familyOOPSpent,
                        progress.familyOOPSpent + progress.familyOOPRemaining
                      )}%)
                      {progress.familyOOPMet && ' ✓'}
                    </Text>
                  </Group>
                  <Progress
                    value={
                      (progress.familyOOPSpent /
                        (progress.familyOOPSpent + progress.familyOOPRemaining)) *
                      100
                    }
                    color={getColor(
                      progress.familyOOPSpent,
                      progress.familyOOPSpent + progress.familyOOPRemaining
                    )}
                    size="lg"
                  />
                </div>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Card>
  );
}
