import React, { useEffect } from 'react';
import { Container, Grid, Title, Stack } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { loadHealthcareConfigs } from '../../features/healthcare/actions';
import ConfigList from './configList';
import HsaSummary from './hsaSummary';
import DeductibleProgress from './deductibleProgress';
import HealthcareExpenses from './healthcareExpenses';

export default function Healthcare() {
  const dispatch = useDispatch<AppDispatch>();

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

        <DeductibleProgress />

        <HealthcareExpenses />
      </Stack>
    </Container>
  );
}
