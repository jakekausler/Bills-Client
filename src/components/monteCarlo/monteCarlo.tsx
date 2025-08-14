import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Group,
  Text,
  NumberInput,
  Stack,
  Badge,
  Alert,
  Collapse,
  UnstyledButton,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AppDispatch } from '../../store';
import {
  selectMonteCarloError,
  selectSelectedSimulation,
  selectMonteCarloDatasets,
  selectMonteCarloLabels,
  selectMonteCarloLoaded,
} from '../../features/monteCarlo/select';
import {
  startNewSimulation,
} from '../../features/monteCarlo/actions';
import { Graph } from '../graph/graph';
import { IconPlayerPlay, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

export default function MonteCarlo() {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector(selectMonteCarloError);
  const selectedSimulation = useSelector(selectSelectedSimulation);
  const datasets = useSelector(selectMonteCarloDatasets);
  const labels = useSelector(selectMonteCarloLabels);
  const graphLoaded = useSelector(selectMonteCarloLoaded);

  const [totalSimulations, setTotalSimulations] = useState(100);
  const [batchSize, setBatchSize] = useState(5);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState<Date | null>(new Date(currentYear, 0, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date(currentYear + 10, 11, 31));
  const [isCreating, setIsCreating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCreateSimulation = async () => {
    if (!startDate || !endDate) {
      return;
    }

    setIsCreating(true);
    try {
      await dispatch(startNewSimulation({
        totalSimulations,
        batchSize,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      }));
    } catch (err) {
      console.error('Failed to create simulation', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Stack gap="lg" h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      <Card withBorder>
        <Stack>
          <UnstyledButton onClick={() => setIsCollapsed(!isCollapsed)} style={{ width: '100%' }}>
            <Group justify="space-between" wrap="nowrap">
              <Text size="lg" fw={700}>Create New Simulation</Text>
              {isCollapsed ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
            </Group>
          </UnstyledButton>

          <Collapse in={!isCollapsed}>
            <Stack>
              <Group>
                <DateInput
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Select start date"
                  size="sm"
                  style={{ flex: 1 }}
                />
                <DateInput
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="Select end date"
                  size="sm"
                  style={{ flex: 1 }}
                />
              </Group>

              <Group>
                <NumberInput
                  label="Total Simulations"
                  value={totalSimulations}
                  onChange={(val) => setTotalSimulations(val as number)}
                  min={1}
                  max={10000}
                  step={10}
                  size="sm"
                  style={{ flex: 1 }}
                />
                <NumberInput
                  label="Batch Size"
                  value={batchSize}
                  onChange={(val) => setBatchSize(val as number)}
                  min={1}
                  max={20}
                  size="sm"
                  style={{ flex: 1 }}
                />
              </Group>

              <Group>
                <Button
                  leftSection={<IconPlayerPlay size={16} />}
                  onClick={handleCreateSimulation}
                  loading={isCreating}
                  size="sm"
                >
                  Start Simulation
                </Button>
              </Group>
            </Stack>
          </Collapse>
        </Stack>
      </Card>

      {selectedSimulation && datasets.length > 0 && (
        <Card withBorder style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Stack style={{ height: '100%' }}>
            <Group>
              <Text size="lg" fw={700}>Simulation Results</Text>
              <Badge color="blue">{selectedSimulation.substring(0, 8)}...</Badge>
            </Group>

            <div style={{ flex: 1, minHeight: 0 }}>
              <Graph
                datasets={datasets}
                labels={labels}
                loaded={graphLoaded}
                type="monteCarlo"
                hideLegend={true}
              />
            </div>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
