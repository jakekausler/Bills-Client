import React, { useEffect, useState } from 'react';
import { Container, Grid, Title, Stack, Group, Card } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { loadHealthcareConfigs } from '../../features/healthcare/actions';
import ConfigList from './configList';
import HsaSummary from './hsaSummary';
import DeductibleProgress from './deductibleProgress';
import HealthcareExpenses from './healthcareExpenses';

export default function Healthcare() {
  const dispatch = useDispatch<AppDispatch>();

  // Shared date range state for both components
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(
    new Date(new Date().getFullYear(), 0, 1)
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(
    new Date(new Date().getFullYear(), 11, 31)
  );

  useEffect(() => {
    dispatch(loadHealthcareConfigs());
  }, [dispatch]);

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        <Title order={1}>Healthcare Management</Title>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <ConfigList />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <HsaSummary />
          </Grid.Col>
        </Grid>

        {/* Shared date filter controls */}
        <Card shadow="sm" p="md">
          <Group justify="flex-end">
            <DateInput
              placeholder="Start date"
              value={filterStartDate}
              onChange={setFilterStartDate}
              clearable
              style={{ width: 150 }}
              label="Date Range"
            />
            <DateInput
              placeholder="End date"
              value={filterEndDate}
              onChange={setFilterEndDate}
              clearable
              style={{ width: 150 }}
              label=" "
            />
          </Group>
        </Card>

        <DeductibleProgress
          startDate={filterStartDate}
          endDate={filterEndDate}
        />

        <HealthcareExpenses
          startDate={filterStartDate}
          endDate={filterEndDate}
        />
      </Stack>
    </Container>
  );
}
