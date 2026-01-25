import React, { useState, useEffect, useCallback } from 'react';
import { Card, Title, Stack, Progress, Text, Group, Loader, Alert, Button, Collapse, Badge } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconChevronDown, IconChevronUp, IconCheck } from '@tabler/icons-react';
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
  const [progressData, setProgressData] = useState<DeductibleProgressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedConfigs, setExpandedConfigs] = useState<Set<string>>(new Set());

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Pass end of current calendar year to get progress for the active plan year
      // For mid-year resets (e.g., July 1), this ensures we see the current plan year
      const currentYearEnd = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
      const data = await getDeductibleProgress(selectedSimulation, currentYearEnd);
      setProgressData(Object.values(data));
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

  const toggleExpanded = (configId: string) => {
    setExpandedConfigs((prev) => {
      const next = new Set(prev);
      if (next.has(configId)) {
        next.delete(configId);
      } else {
        next.add(configId);
      }
      return next;
    });
  };

  if (progressData.length === 0) {
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
        Deductible Progress - {progressData[0]?.planYear}
      </Title>

      <Stack gap="lg">
        {progressData.map((progress) => {
          const isExpanded = expandedConfigs.has(progress.configId);
          return (
            <Card key={progress.configId} withBorder p="md">
              {/* Header with config name and covered persons */}
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={700} size="lg">
                    {progress.configName} {progress.planYear}
                  </Text>
                  <Group gap="xs" mt={4}>
                    <Text size="sm" c="dimmed">
                      Covered:
                    </Text>
                    {progress.coveredPersons.map((person) => (
                      <Badge key={person} variant="light" size="sm">
                        {person}
                      </Badge>
                    ))}
                  </Group>
                </div>
              </Group>

              {/* Family-level progress bars */}
              <Stack gap="sm" mb="md">
                <div>
                  <Group justify="space-between" mb={4}>
                    <Group gap="xs">
                      <Text size="sm" fw={500}>Family Deductible</Text>
                      {progress.familyDeductibleMet && (
                        <IconCheck size={16} color="green" />
                      )}
                    </Group>
                    <Text size="sm" fw={500}>
                      ${progress.familyDeductibleSpent.toLocaleString()} / $
                      {progress.familyDeductibleLimit.toLocaleString()}
                      {' '}({getPercent(progress.familyDeductibleSpent, progress.familyDeductibleLimit)}%)
                    </Text>
                  </Group>
                  <Progress
                    value={
                      (progress.familyDeductibleSpent / progress.familyDeductibleLimit) * 100
                    }
                    color={getColor(progress.familyDeductibleSpent, progress.familyDeductibleLimit)}
                    size="lg"
                  />
                </div>

                <div>
                  <Group justify="space-between" mb={4}>
                    <Group gap="xs">
                      <Text size="sm" fw={500}>Family Out-of-Pocket Max</Text>
                      {progress.familyOOPMet && (
                        <IconCheck size={16} color="green" />
                      )}
                    </Group>
                    <Text size="sm" fw={500}>
                      ${progress.familyOOPSpent.toLocaleString()} / $
                      {progress.familyOOPLimit.toLocaleString()}
                      {' '}({getPercent(progress.familyOOPSpent, progress.familyOOPLimit)}%)
                    </Text>
                  </Group>
                  <Progress
                    value={
                      (progress.familyOOPSpent / progress.familyOOPLimit) * 100
                    }
                    color={getColor(progress.familyOOPSpent, progress.familyOOPLimit)}
                    size="lg"
                  />
                </div>
              </Stack>

              {/* Individual breakdown toggle */}
              <Button
                variant="subtle"
                size="xs"
                onClick={() => toggleExpanded(progress.configId)}
                rightSection={isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                fullWidth
              >
                Individual Breakdown
              </Button>

              <Collapse in={isExpanded}>
                <Stack gap="md" mt="md" pl="md">
                  {progress.individualProgress.map((person) => (
                    <div key={person.personName}>
                      <Text fw={600} mb="xs">
                        {person.personName}
                      </Text>
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Group gap="xs">
                            <Text size="sm">Deductible</Text>
                            {person.deductibleMet && (
                              <IconCheck size={14} color="green" />
                            )}
                          </Group>
                          <Text size="sm">
                            ${person.deductibleSpent.toLocaleString()} / $
                            {progress.individualDeductibleLimit.toLocaleString()}
                          </Text>
                        </Group>
                        <Group justify="space-between">
                          <Group gap="xs">
                            <Text size="sm">Out-of-Pocket</Text>
                            {person.oopMet && (
                              <IconCheck size={14} color="green" />
                            )}
                          </Group>
                          <Text size="sm">
                            ${person.oopSpent.toLocaleString()} / $
                            {progress.individualOOPLimit.toLocaleString()}
                          </Text>
                        </Group>
                      </Stack>
                    </div>
                  ))}
                </Stack>
              </Collapse>
            </Card>
          );
        })}
      </Stack>
    </Card>
  );
}
