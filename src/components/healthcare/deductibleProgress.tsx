import React, { useState, useEffect, useCallback } from 'react';
import { Card, Title, Stack, Progress, Text, Group, Loader, Alert, Button, Collapse, Badge } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconChevronDown, IconChevronUp, IconCheck } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getDeductibleProgress, getHealthcareProgressHistory } from '../../features/healthcare/api';
import { selectHealthcareConfigs } from '../../features/healthcare/select';
import { DeductibleProgress as DeductibleProgressType, ProgressHistoryDataPoint } from '../../types/types';
import ProgressMiniGraph from './ProgressMiniGraph';

interface DeductibleProgressProps {
  startDate: Date | null;
  endDate: Date | null;
}

export default function DeductibleProgress({ startDate, endDate }: DeductibleProgressProps) {
  const selectedSimulation = useSelector(
    (state: RootState) =>
      state.simulations.simulations.find((s) => s.selected)?.name || 'Default'
  );
  const configs = useSelector(selectHealthcareConfigs);
  const [progressData, setProgressData] = useState<DeductibleProgressType[]>([]);
  const [historyData, setHistoryData] = useState<Record<string, ProgressHistoryDataPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedConfigs, setExpandedConfigs] = useState<Set<string>>(new Set());

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the provided endDate, or fall back to end of current calendar year
      const effectiveEndDate = endDate
        ? endDate.toISOString().split('T')[0]
        : new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
      const data = await getDeductibleProgress(selectedSimulation, effectiveEndDate);
      const progressArray = Object.values(data);
      setProgressData(progressArray);

      // Fetch history for each config using the provided date range
      const historyMap: Record<string, ProgressHistoryDataPoint[]> = {};
      for (const progress of progressArray) {
        const config = configs.find((c) => c.id === progress.configId);
        if (!config) continue;

        // Use provided dates or fall back to plan year dates
        let historyStartDate: string;
        let historyEndDate: string;

        if (startDate && endDate) {
          historyStartDate = startDate.toISOString().split('T')[0];
          historyEndDate = endDate.toISOString().split('T')[0];
        } else {
          // Calculate plan year start/end dates as fallback
          historyStartDate = `${progress.planYear}-${String(config.resetMonth).padStart(2, '0')}-${String(config.resetDay).padStart(2, '0')}`;
          historyEndDate = `${progress.planYear + 1}-${String(config.resetMonth).padStart(2, '0')}-${String(config.resetDay - 1).padStart(2, '0')}`;
        }

        const history = await getHealthcareProgressHistory(
          selectedSimulation,
          progress.configId,
          historyStartDate,
          historyEndDate
        );
        historyMap[progress.configId] = history;
      }
      setHistoryData(historyMap);

      // Update progressData with final values from history data
      const updatedProgressData = progressArray.map(progress => {
        const history = historyMap[progress.configId] || [];

        // Get final family values (personName === null)
        const familyHistory = history.filter(h => h.personName === null);
        const lastFamilyPoint = familyHistory[familyHistory.length - 1];

        // Get final individual values
        const updatedIndividualProgress = progress.individualProgress.map(person => {
          const personHistory = history.filter(h => h.personName === person.personName);
          const lastPersonPoint = personHistory[personHistory.length - 1];

          if (lastPersonPoint) {
            return {
              ...person,
              deductibleSpent: lastPersonPoint.deductibleSpent,
              deductibleMet: lastPersonPoint.deductibleSpent >= progress.individualDeductibleLimit,
              oopSpent: lastPersonPoint.oopSpent,
              oopMet: lastPersonPoint.oopSpent >= progress.individualOOPLimit,
            };
          }
          return person;
        });

        if (lastFamilyPoint) {
          return {
            ...progress,
            familyDeductibleSpent: lastFamilyPoint.deductibleSpent,
            familyDeductibleMet: lastFamilyPoint.deductibleSpent >= progress.familyDeductibleLimit,
            familyDeductibleRemaining: Math.max(0, progress.familyDeductibleLimit - lastFamilyPoint.deductibleSpent),
            familyOOPSpent: lastFamilyPoint.oopSpent,
            familyOOPMet: lastFamilyPoint.oopSpent >= progress.familyOOPLimit,
            familyOOPRemaining: Math.max(0, progress.familyOOPLimit - lastFamilyPoint.oopSpent),
            individualProgress: updatedIndividualProgress,
          };
        }

        return { ...progress, individualProgress: updatedIndividualProgress };
      });

      setProgressData(updatedProgressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [selectedSimulation, configs, startDate, endDate]);

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
          const history = historyData[progress.configId] || [];

          // Filter history data for family and per-person
          const familyDeductibleHistory = history
            .filter(h => h.personName === null)
            .map(h => ({ date: h.date, value: h.deductibleSpent }));
          const familyOOPHistory = history
            .filter(h => h.personName === null)
            .map(h => ({ date: h.date, value: h.oopSpent }));

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

              {/* Family-level progress bars with inline graphs */}
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
                  <ProgressMiniGraph
                    data={familyDeductibleHistory}
                    limit={progress.familyDeductibleLimit}
                    color="blue"
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
                  <ProgressMiniGraph
                    data={familyOOPHistory}
                    limit={progress.familyOOPLimit}
                    color="orange"
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
                  {progress.individualProgress.map((person) => {
                    // Filter history for this person
                    const personDeductibleHistory = history
                      .filter(h => h.personName === person.personName)
                      .map(h => ({ date: h.date, value: h.deductibleSpent }));
                    const personOOPHistory = history
                      .filter(h => h.personName === person.personName)
                      .map(h => ({ date: h.date, value: h.oopSpent }));

                    return (
                      <div key={person.personName}>
                        <Text fw={600} mb="xs">
                          {person.personName}
                        </Text>
                        <Stack gap="sm">
                          <div>
                            <Group justify="space-between" mb={4}>
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
                            <ProgressMiniGraph
                              data={personDeductibleHistory}
                              limit={progress.individualDeductibleLimit}
                              color="cyan"
                              height={100}
                            />
                          </div>
                          <div>
                            <Group justify="space-between" mb={4}>
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
                            <ProgressMiniGraph
                              data={personOOPHistory}
                              limit={progress.individualOOPLimit}
                              color="grape"
                              height={100}
                            />
                          </div>
                        </Stack>
                      </div>
                    );
                  })}
                </Stack>
              </Collapse>
            </Card>
          );
        })}
      </Stack>
    </Card>
  );
}
