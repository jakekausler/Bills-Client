import React from 'react';
import { ActionIcon, Button, LoadingOverlay, NumberInput, Stack, Table, Text, TextInput } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSelectedSimulation,
  selectSimulations,
  selectUsedVariables,
  selectUsedVariablesLoaded,
} from '../../features/simulations/select';
import { AppDispatch } from '../../store';
import { saveSimulations } from '../../features/simulations/actions';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { ConditionalTooltip } from '../helpers/conditionalTooltip';
import { UsedVariable } from '../../types/types';
import { toDateString } from '../../utils/date';
import { EditableDateInput } from '../helpers/editableDateInput';

function UsedVariableTooltip({ used }: { used: UsedVariable[] }) {
  return (
    <Stack>
      <Text>This variable is in use.</Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Account</Table.Th>
            {used.some((u) => !!u.date) && <Table.Th>Date</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {used.map((u, idx) => {
            return (
              <Table.Tr key={idx}>
                <Table.Td>{u.name}</Table.Td>
                <Table.Td>{u.account || u.from || 'unknown'}</Table.Td>
                {!!u.date && <Table.Td>{new Date(u.date).toLocaleDateString()}</Table.Td>}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

export default function Variables() {
  const dispatch = useDispatch<AppDispatch>();
  const simulation = useSelector(selectSelectedSimulation);
  const simulations = useSelector(selectSimulations);
  const [variableNames, setVariableNames] = useState<string[]>(
    simulation?.variables ? Object.keys(simulation.variables) : [],
  );
  const [variableValues, setVariableValues] = useState<(string | number)[]>(
    simulation?.variables ? Object.values(simulation.variables).map((v) => v.value) : [],
  );
  const usedVariables = useSelector(selectUsedVariables);
  const variablesLoaded = useSelector(selectUsedVariablesLoaded);

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const isLoading = !variablesLoaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [variablesLoaded]);

  useEffect(() => {
    if (!simulation) {
      return;
    }
    setVariableNames(Object.keys(simulation.variables));
    setVariableValues(Object.values(simulation.variables).map((v) => v.value));
  }, [simulation]);

  if (!simulation) {
    return null;
  }
  const name = simulation.name;
  const variables = simulation.variables;

  return (
    <Stack h="100%" w="100%" pos="relative">
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <h2>{name} Variables</h2>
      <Table>
        <Table.Tbody>
          {Object.entries(variables).map(([variable, value], idx) => {
            return (
              <ConditionalTooltip
                label={<UsedVariableTooltip used={usedVariables[variable]} />}
                condition={usedVariables[variable]?.length > 0}
                key={variable}
              >
                <Table.Tr w="100%">
                  <Table.Td>
                    <TextInput
                      disabled={usedVariables[variable]?.length > 0}
                      style={{ flex: 1 }}
                      label="Name"
                      value={variableNames[idx]}
                      onBlur={() => {
                        if (
                          variableNames[idx] === '' ||
                          variableNames[idx] === undefined ||
                          variableNames[idx] === null
                        )
                          return;
                        setVariableNames(variableNames.map((name, i) => (i === idx ? variable : name)));
                        if (variableNames[idx] !== variable) {
                          dispatch(
                            saveSimulations(
                              simulations.map((s) => {
                                const updatedSimulation = {
                                  ...s,
                                  variables: {
                                    ...s.variables,
                                    [variableNames[idx]]: s.variables[variable],
                                  },
                                };
                                delete updatedSimulation.variables[variable];
                                return updatedSimulation;
                              }),
                            ),
                          );
                        }
                      }}
                      onChange={(event) => {
                        setVariableNames(variableNames.map((n, i) => (i === idx ? event.target.value : n)));
                      }}
                    />
                  </Table.Td>
                  <Table.Td>
                    {value.type === 'amount' && (
                      <NumberInput
                        style={{ flex: 1 }}
                        label="Value"
                        value={variableValues[idx]}
                        onChange={(amount) => {
                          setVariableValues(variableValues.map((v, i) => (i === idx ? amount : v)));
                        }}
                        onBlur={(event) => {
                          setVariableValues(
                            variableValues.map((v, i) =>
                              i === idx
                                ? typeof event.target.value === 'number'
                                  ? event.target.value
                                  : parseFloat(event.target.value)
                                : v,
                            ),
                          );
                          if (variableValues[idx] !== value.value) {
                            dispatch(
                              saveSimulations(
                                simulations.map((s) => ({
                                  ...s,
                                  variables: {
                                    ...s.variables,
                                    [variable]: {
                                      ...s.variables[variable],
                                      value:
                                        typeof event.target.value === 'number'
                                          ? event.target.value
                                          : parseFloat(event.target.value),
                                    },
                                  },
                                })),
                              ),
                            );
                          }
                        }}
                      />
                    )}
                    {value.type === 'date' && (
                      <EditableDateInput
                        label="Value"
                        value={value.value as string}
                        onBlur={(date) => {
                          if (!date) {
                            return;
                          }
                          if (date !== value.value) {
                            dispatch(
                              saveSimulations(
                                simulations.map((s) => ({
                                  ...s,
                                  variables: {
                                    ...s.variables,
                                    [variable]: {
                                      ...s.variables[variable],
                                      value: date,
                                    },
                                  },
                                })),
                              ),
                            );
                          }
                        }}
                        placeholder="Select date"
                      />
                    )}
                  </Table.Td>
                  <Table.Td style={{ position: 'relative' }}>
                    <ActionIcon
                      style={{ bottom: 'px', position: 'absolute' }}
                      size="34px"
                      disabled={usedVariables[variable]?.length > 0}
                      onClick={() =>
                        dispatch(
                          saveSimulations(
                            simulations.map((s) => {
                              const updatedSimulation = {
                                ...s,
                                variables: {
                                  ...s.variables,
                                },
                              };
                              delete updatedSimulation.variables[variable];
                              return updatedSimulation;
                            }),
                          ),
                        )
                      }
                    >
                      <IconX />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              </ConditionalTooltip>
            );
          })}
          <Table.Tr>
            <Table.Td>
              <Button
                w="100%"
                onClick={() =>
                  dispatch(
                    saveSimulations(
                      simulations.map((s) => ({
                        ...s,
                        variables: {
                          ...s.variables,
                          [`Variable ${Object.keys(s.variables).length}`]: {
                            type: 'amount',
                            value: 0,
                          },
                        },
                      })),
                    ),
                  )
                }
              >
                Add Amount
              </Button>
            </Table.Td>
            <Table.Td>
              <Button
                w="100%"
                onClick={() =>
                  dispatch(
                    saveSimulations(
                      simulations.map((s) => ({
                        ...s,
                        variables: {
                          ...s.variables,
                          [`Variable ${Object.keys(s.variables).length}`]: {
                            type: 'date',
                            value: toDateString(new Date()),
                          },
                        },
                      })),
                    ),
                  )
                }
              >
                Add Date
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
