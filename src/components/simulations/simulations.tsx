import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSimulations, selectSimulationsLoaded } from '../../features/simulations/select';
import { AppDispatch } from '../../store';
import { ActionIcon, Checkbox, LoadingOverlay, Radio, Stack, Table, Text, TextInput } from '@mantine/core';
import { loadSimulations, saveSimulations } from '../../features/simulations/actions';
import { useEffect, useState } from 'react';
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

export default function Simulations() {
  const simulations = useSelector(selectSimulations);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadSimulations());
  }, [dispatch]);

  const simulationsLoaded = useSelector(selectSimulationsLoaded);

  const [simulationNames, setSimulationNames] = useState(simulations.map((s) => s.name));

  useEffect(() => {
    setSimulationNames(simulations.map((s) => s.name));
  }, [simulations]);

  const showLoading = useDelayedLoading(!simulationsLoaded);

  return (
    <Stack h="100%" w="100%" pos="relative" aria-busy={showLoading}>
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <Radio.Group
        value={simulations.find((s) => s.selected)?.name}
        onChange={(value) => {
          dispatch(saveSimulations(simulations.map((s) => ({ ...s, selected: s.name === value }))));
        }}
      >
        <Table aria-label="Simulations list">
          <Table.Thead>
            <Table.Tr>
              <Table.Th scope="col">Name</Table.Th>
              <Table.Th scope="col" aria-label="Visible">
                <IconEye />
              </Table.Th>
              <Table.Th scope="col" aria-label="Selected">
                <IconEdit />
              </Table.Th>
              <Table.Th scope="col">
                <ActionIcon
                  onClick={() => {
                    setSimulationNames([...simulationNames, `Simulation ${simulations.length + 1}`]);
                    dispatch(
                      saveSimulations([
                        ...simulations,
                        {
                          name: `Simulation ${simulations.length + 1}`,
                          enabled: true,
                          selected: false,
                          variables: simulations.find((s) => s.name === 'Default')?.variables ?? {},
                        },
                      ]),
                    );
                  }}
                  aria-label="Add simulation"
                >
                  <IconPlus />
                </ActionIcon>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {simulations.map((simulation, index) => (
              <Table.Tr key={simulation.name}>
                <Table.Td>
                  {simulation.name === 'Default' && <Text>{simulation.name}</Text>}
                  {simulation.name !== 'Default' && (
                    <TextInput
                      value={simulationNames[index]}
                      onChange={(e) => {
                        setSimulationNames(simulationNames.map((n, i) => (i === index ? e.target.value : n)));
                      }}
                      onBlur={() => {
                        dispatch(saveSimulations(simulations.map((s, i) => ({ ...s, name: simulationNames[i] }))));
                      }}
                      aria-label="Simulation name"
                    />
                  )}
                </Table.Td>
                <Table.Td>
                  <Checkbox
                    checked={simulation.enabled}
                    onChange={() =>
                      dispatch(
                        saveSimulations(
                          simulations.map((s) => (s.name === simulation.name ? { ...s, enabled: !s.enabled } : s)),
                        ),
                      )
                    }
                    aria-label={`Toggle ${simulation.name} visibility`}
                  />
                </Table.Td>
                <Table.Td>
                  <Radio value={simulation.name} aria-label={`Select ${simulation.name}`} />
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    onClick={() => {
                      dispatch(
                        saveSimulations(
                          simulations
                            .filter((s) => s.name !== simulation.name)
                            // Ensure that the default simulation is selected if the deleted simulation is selected
                            .map((s) => ({
                              ...s,
                              selected: simulation.selected && s.name === 'Default' ? true : s.selected,
                            })),
                        ),
                      );
                      setSimulationNames(simulationNames.filter((_, i) => i !== index));
                    }}
                    disabled={simulation.name === 'Default'}
                    aria-label="Delete simulation"
                  >
                    <IconTrash />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Radio.Group>
    </Stack>
  );
}
