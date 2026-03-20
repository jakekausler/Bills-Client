import React, { useMemo, useState } from 'react';
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
  VisuallyHidden,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AppDispatch } from '../../store';
import { toDateString } from '../../utils/date';
import {
  selectMonteCarloError,
  selectSelectedSimulation,
  selectMonteCarloDatasets,
  selectAccountNames,
  selectReportingAccount,
  selectShowReal,
  selectShowDeterministic,
  selectMonteCarloLoaded,
} from '../../features/monteCarlo/select';
import {
  startNewSimulation,
} from '../../features/monteCarlo/actions';
import { ControlsBar } from './controlsBar';
import { SummaryCards } from './summaryCards';
import { mcViews } from './viewRegistry';
// Side-effect imports: register views into the registry
import './fanChart';
import './failureHistogram';
import './worstCases';
import { IconPlayerPlay, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { selectVisibleAccounts } from '../../features/accounts/select';

export default function MonteCarlo() {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector(selectMonteCarloError);
  const selectedSimulation = useSelector(selectSelectedSimulation);
  const datasets = useSelector(selectMonteCarloDatasets);
  const accountNames = useSelector(selectAccountNames);
  const visibleAccounts = useSelector(selectVisibleAccounts);
  const reportingAccount = useSelector(selectReportingAccount);
  const showReal = useSelector(selectShowReal);
  const showDeterministic = useSelector(selectShowDeterministic);
  const loaded = useSelector(selectMonteCarloLoaded);

  // Filter MC account names to exclude accounts hidden *after* the simulation ran.
  // If the accounts store hasn't loaded yet, show all MC account names unfiltered
  // (the MC worker already excludes accounts that were hidden at simulation time).
  const filteredAccountNames = useMemo(() => {
    if (visibleAccounts.length === 0) return accountNames;
    const visibleIds = new Set(visibleAccounts.map((a) => a.id));
    const filtered = accountNames.filter((acct) => visibleIds.has(acct.id));
    // If filtering removed everything (IDs changed, etc.), fall back to unfiltered
    return filtered.length > 0 ? filtered : accountNames;
  }, [accountNames, visibleAccounts]);

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
        startDate: toDateString(startDate),
        endDate: toDateString(endDate),
      }));
    } catch (err) {
      console.error('Failed to create simulation', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Stack gap="lg" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)' }}>
      <VisuallyHidden component="h2">Monte Carlo Simulation</VisuallyHidden>
      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      <Card withBorder>
        <Stack>
          <UnstyledButton onClick={() => setIsCollapsed(!isCollapsed)} style={{ width: '100%' }} aria-expanded={!isCollapsed} aria-controls="monte-carlo-form">
            <Group justify="space-between" wrap="nowrap">
              <Text size="lg" fw={700}>Create New Simulation</Text>
              {isCollapsed ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
            </Group>
          </UnstyledButton>

          <Collapse in={!isCollapsed} id="monte-carlo-form">
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
        <>
          <Card withBorder>
            <Stack>
              <Group>
                <Text size="lg" fw={700}>Simulation Results</Text>
                <Badge color="blue">{selectedSimulation.substring(0, 8)}...</Badge>
              </Group>

              <ControlsBar
                simulationId={selectedSimulation}
                accountNames={filteredAccountNames}
              />

              <SummaryCards />
            </Stack>
          </Card>

          {loaded && (
            <div
              className="mc-view-grid"
              style={{
                flex: 1,
                minHeight: 400,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: '1fr',
                gap: '16px',
              }}
            >
              {mcViews.map((view) => (
                <div
                  key={view.id}
                  style={{ gridColumn: `span ${view.columns}`, minHeight: 0, overflow: 'hidden' }}
                >
                  <view.component
                    simulationId={selectedSimulation}
                    reportingAccount={reportingAccount}
                    showReal={showReal}
                    showDeterministic={showDeterministic}
                    graphData={null}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Stack>
  );
}
