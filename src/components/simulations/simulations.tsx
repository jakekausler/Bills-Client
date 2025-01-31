import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectSimulations, selectSimulationsLoaded } from "../../features/simulations/select";
import { AppDispatch } from "../../store";
import { ActionIcon, Checkbox, LoadingOverlay, Radio, Stack, Table, Text, TextInput } from "@mantine/core";
import { loadSimulations, saveSimulations } from "../../features/simulations/actions";
import { useEffect, useState } from "react";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";

export default function Simulations() {
  const simulations = useSelector(selectSimulations);
  console.log(simulations);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadSimulations());
  }, [dispatch]);

  const simulationsLoaded = useSelector(selectSimulationsLoaded);

  const [simulationNames, setSimulationNames] = useState(simulations.map((s) => s.name));

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const isLoading = !simulationsLoaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [simulationsLoaded]);

  return (
    <Stack h="100%" w="100%" pos="relative">
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <Radio.Group
        value={simulations.find((s) => s.selected)?.name}
        onChange={(value) => {
          dispatch(saveSimulations(simulations.map((s) => ({ ...s, selected: s.name === value }))))
        }}
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th><IconEye /></Table.Th>
              <Table.Th><IconEdit /></Table.Th>
              <Table.Th>
                <ActionIcon
                  onClick={() => {
                    setSimulationNames([...simulationNames, `Simulation ${simulations.length + 1}`]);
                    dispatch(saveSimulations([...simulations, { name: `Simulation ${simulations.length + 1}`, enabled: true, selected: false, variables: simulations.find((s) => s.name === 'Default')?.variables ?? {} }]));
                  }}
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
                  {simulation.name === 'Default' && (
                    <Text>{simulation.name}</Text>
                  )}
                  {simulation.name !== 'Default' && (
                    <TextInput
                      value={simulationNames[index]}
                      onChange={(e) => {
                        setSimulationNames(simulationNames.map((n, i) => i === index ? e.target.value : n));
                      }}
                      onBlur={() => {
                        dispatch(saveSimulations(simulations.map((s, i) => ({ ...s, name: simulationNames[i] }))))
                      }}
                    />
                  )}
                </Table.Td>
                <Table.Td>
                  <Checkbox
                    checked={simulation.enabled}
                    onChange={() =>
                      dispatch(
                        saveSimulations(
                          simulations.map((s) =>
                            s.name === simulation.name ? { ...s, enabled: !s.enabled } : s,
                          ),
                        ),
                      )
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <Radio value={simulation.name} />
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    onClick={() => {
                      dispatch(saveSimulations(
                        simulations
                          .filter((s) => s.name !== simulation.name)
                          // Ensure that the default simulation is selected if the deleted simulation is selected
                          .map((s) => ({ ...s, selected: simulation.selected && s.name === 'Default' ? true : s.selected }))
                      ));
                      setSimulationNames(simulationNames.filter((n) => n !== simulation.name));
                    }}
                    disabled={simulation.name === 'Default'}
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
