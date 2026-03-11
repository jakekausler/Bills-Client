import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { Box, LoadingOverlay, Stack, Table, Text, useMantineTheme } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { CheckboxIcon } from '../helpers/checkboxIcon';
import { selectSimulations, selectSimulationsLoaded } from '../../features/simulations/select';

export default function SimulationSelector({
  selectedSimulations,
  updateSelectedSimulations,
}: {
  selectedSimulations: string[];
  updateSelectedSimulations: ActionCreatorWithPayload<string[], 'graphView/updateSelectedSimulations'>;
}) {
  const simulations = useSelector(selectSimulations);
  const simulationsLoaded = useSelector(selectSimulationsLoaded);
  const dispatch = useDispatch<AppDispatch>();

  const showLoading = useDelayedLoading(!simulationsLoaded);

  const theme = useMantineTheme();

  return (
    <Stack h="100%" w="100%" pos="relative" aria-busy={showLoading}>
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <Table verticalSpacing={0} withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">Simulation</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Text size="xs" fw={500}>
                Select All
              </Text>
            </Table.Td>
            <Table.Td>
              <CheckboxIcon
                checked={selectedSimulations.length === simulations.length}
                onChange={() =>
                  dispatch(
                    updateSelectedSimulations(
                      selectedSimulations.length === simulations.length ? [] : simulations.map((s) => s.name),
                    ),
                  )
                }
                checkedIcon={<IconEye stroke={1.5} color={theme.colors.orange[6]} size={16} />}
                uncheckedIcon={<IconEyeOff stroke={1.5} color={theme.colors.orange[6]} size={16} />}
                ariaLabel="Toggle all simulations visibility"
              />
            </Table.Td>
          </Table.Tr>
          {simulations.map((simulation) => (
            <React.Fragment key={simulation.name}>
              <Table.Tr aria-hidden="true" role="presentation">
                <Table.Td>
                  <Box h={8} />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <Text size="xs" fw={500}>
                    {simulation.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <CheckboxIcon
                    checked={selectedSimulations.includes(simulation.name)}
                    onChange={() =>
                      dispatch(
                        updateSelectedSimulations(
                          selectedSimulations.includes(simulation.name)
                            ? selectedSimulations.filter((s) => s !== simulation.name)
                            : [...selectedSimulations, simulation.name],
                        ),
                      )
                    }
                    checkedIcon={<IconEye stroke={1.5} color={theme.colors.blue[6]} size={16} />}
                    uncheckedIcon={<IconEyeOff stroke={1.5} color={theme.colors.blue[6]} size={16} />}
                    ariaLabel={`Toggle ${simulation.name} visibility`}
                  />
                </Table.Td>
              </Table.Tr>
            </React.Fragment>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
