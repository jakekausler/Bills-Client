import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEndDate,
  selectInterests,
  selectInterestsLoaded,
  selectNamesLoaded,
  selectStartDate,
} from '../../features/activities/select';
import { ActionIcon, FocusTrap, Group, LoadingOverlay, Select, Stack, Table } from '@mantine/core';
import {
  IconDeviceFloppy,
  IconPlus,
  IconSort09,
  IconTrash,
  IconVariable,
  IconVariableOff,
  IconX,
} from '@tabler/icons-react';
import { AppDispatch } from '../../store';
import { updateInterests } from '../../features/activities/slice';
import { saveInterests } from '../../features/activities/actions';
import { selectAccountsLoaded, selectSelectedAccount } from '../../features/accounts/select';
import { selectGraphEndDate, selectGraphStartDate } from '../../features/graph/select';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { v4 as uuidv4 } from 'uuid';
import { toDateString } from '../../utils/date';
import { selectCategoriesLoaded } from '../../features/categories/select';
import { useEffect } from 'react';
import { useState } from 'react';
import { EditableDateInput } from '../helpers/editableDateInput';
import { CalculatorEditor } from '../helpers/calculatorEditor';
import { Interest } from '../../types/types';
import { selectSelectedSimulationVariables } from '../../features/simulations/select';

dayjs.extend(utc);

export const InterestEditor = ({ resetSelected }: { resetSelected: () => void }) => {
  const interests = useSelector(selectInterests) || [];
  const account = useSelector(selectSelectedAccount);
  const startDate = new Date(useSelector(selectStartDate));
  const endDate = new Date(useSelector(selectEndDate));
  const graphStartDate = new Date(useSelector(selectGraphStartDate));
  const graphEndDate = new Date(useSelector(selectGraphEndDate));
  const interestsLoaded = useSelector(selectInterestsLoaded);
  const accountsLoaded = useSelector(selectAccountsLoaded);
  const categoriesLoaded = useSelector(selectCategoriesLoaded);
  const namesLoaded = useSelector(selectNamesLoaded);

  const simulationVariables = useSelector(selectSelectedSimulationVariables);
  const amountVariables = simulationVariables
    ? Object.entries(simulationVariables)
        .filter(([_, value]) => value.type === 'amount')
        .map(([name, _]) => name)
    : [];

  const dispatch = useDispatch<AppDispatch>();

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const isLoading = !interestsLoaded || !accountsLoaded || !categoriesLoaded || !namesLoaded;

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [interestsLoaded, accountsLoaded, categoriesLoaded, namesLoaded]);

  if (!account) {
    return null;
  }

  const getNextDate = () => {
    const lastInterest = interests.length > 0 ? interests[interests.length - 1] : null;
    if (!lastInterest) return toDateString(new Date());
    const date = new Date(lastInterest.applicableDate);
    switch (lastInterest.compounded) {
      case 'day':
        return toDateString(dayjs.utc(date).add(1, 'day').toDate());
      case 'week':
        return toDateString(dayjs.utc(date).add(1, 'week').toDate());
      case 'month':
        return toDateString(dayjs.utc(date).add(1, 'month').toDate());
      case 'year':
        return toDateString(dayjs.utc(date).add(1, 'year').toDate());
      default:
        return toDateString(new Date());
    }
  };

  const getNextCompounded = () => {
    const lastInterest = interests.length > 0 ? interests[interests.length - 1] : null;
    if (!lastInterest) return 'month';
    return lastInterest.compounded;
  };

  const validate = (interest: Interest, name: string, value: any) => {
    if (name === 'applicableDate') {
      const date = new Date(value);
      if (date.toString() === 'Invalid Date') {
        return 'Invalid date';
      }
    }
    if (name === 'apr') {
      if (isNaN(value) || typeof value === 'boolean') {
        return 'Invalid apr';
      }
    }
    if (name === 'aprVariable') {
      // Only validate if using a variable
      if (interest.aprIsVariable && !amountVariables.includes(value as string)) {
        return 'Invalid variable';
      }
    }
    if (name === 'applicableDateVariable') {
      // Only validate if using a variable (dateVariables not currently implemented)
      if (interest.applicableDateIsVariable && value !== null) {
        return 'Invalid variable';
      }
    }
    if (name === 'compounded') {
      if (!['day', 'week', 'month', 'year'].includes(value)) {
        return 'Invalid compounded';
      }
    }
    return null;
  };

  const allValid = (ints?: Interest[]) => {
    const interestsToValidate = ints || interests;

    const result = interestsToValidate.every((interest) => {
      const interestValid = Object.entries(interest).every(([key, value]) => {
        const validationResult = validate(interest, key, value);
        return validationResult === null;
      });
      return interestValid;
    });

    return result;
  };

  const handleEnter = (index: number, apr?: number) => {
    if (isNaN(apr as number)) {
      return;
    }
    const ints: Interest[] = interests.map((interest, i) => {
      if (i === index) {
        return {
          ...interest,
          apr: apr || interest.apr,
        };
      }
      return interest;
    });
    if (!allValid(ints)) {
      return;
    }
    dispatch(saveInterests(account, ints, startDate, endDate, graphStartDate, graphEndDate));
    resetSelected();
  };

  return (
    <Stack h="100%" w="100%" justify="space-between" pos="relative">
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <FocusTrap.InitialFocus />
      <Table horizontalSpacing={4}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th fz="xs">Start</Table.Th>
            <Table.Th fz="xs">APR</Table.Th>
            <Table.Th fz="xs">Compounded</Table.Th>
            <Table.Th fz="xs"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {interests.map((interest, index) => (
            <Table.Tr key={interest.id}>
              <Table.Td>
                <EditableDateInput
                  size="xs"
                  value={interest.applicableDate}
                  onBlur={(value) => {
                    if (!value) return;
                    dispatch(
                      updateInterests(
                        interests.map((i) =>
                          i.id === interest.id
                            ? {
                                ...i,
                                applicableDate: value,
                              }
                            : i,
                        ),
                      ),
                    );
                  }}
                  placeholder="Start date"
                />
              </Table.Td>
              <Table.Td>
                <Group w="100%">
                  {interest.aprIsVariable ? (
                    <Select
                      style={{ flex: 1 }}
                      size="xs"
                      data={amountVariables.map((name) => ({
                        value: name,
                        label: name,
                      }))}
                      value={interest.aprVariable}
                      onChange={(aprVariable) => {
                        if (!aprVariable) return;
                        dispatch(
                          updateInterests(
                            interests.map((i) =>
                              i.id === interest.id
                                ? {
                                    ...i,
                                    aprVariable: aprVariable as string,
                                  }
                                : i,
                            ),
                          ),
                        );
                      }}
                      error={validate(interest, 'aprVariable', interest.aprVariable) || undefined}
                    />
                  ) : (
                    <CalculatorEditor
                      style={{ flex: 1 }}
                      size="xs"
                      value={Number(interest.apr)}
                      onChange={(apr: number) => {
                        dispatch(
                          updateInterests(
                            interests.map((i) =>
                              i.id === interest.id
                                ? {
                                    ...i,
                                    apr: typeof apr === 'number' ? apr : parseFloat(apr),
                                  }
                                : i,
                            ),
                          ),
                        );
                      }}
                      error={validate(interest, 'apr', interest.apr) || undefined}
                      handleEnter={(apr) => handleEnter(index, apr)}
                    />
                  )}
                  <ActionIcon
                    size="sm"
                    ml={-12}
                    onClick={() => {
                      dispatch(
                        updateInterests(
                          interests.map((interest, i) => ({
                            ...interest,
                            aprIsVariable: i === index ? !interest.aprIsVariable : interest.aprIsVariable,
                          })),
                        ),
                      );
                    }}
                  >
                    {interest.aprIsVariable ? <IconVariable /> : <IconVariableOff />}
                  </ActionIcon>
                </Group>
              </Table.Td>
              <Table.Td>
                <Select
                  size="xs"
                  data={[
                    { value: 'day', label: 'Daily' },
                    { value: 'week', label: 'Weekly' },
                    { value: 'month', label: 'Monthly' },
                    { value: 'year', label: 'Yearly' },
                  ]}
                  value={interest.compounded}
                  onChange={(compounded) => {
                    if (!compounded) return;
                    dispatch(
                      updateInterests(
                        interests.map((i) =>
                          i.id === interest.id
                            ? {
                                ...i,
                                compounded: compounded as 'day' | 'week' | 'month' | 'year',
                              }
                            : i,
                        ),
                      ),
                    );
                  }}
                  error={validate(interest, 'compounded', interest.compounded)}
                />
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  size="sm"
                  mt={6}
                  onClick={() => {
                    dispatch(updateInterests(interests.filter((i) => i.id !== interest.id)));
                  }}
                >
                  <IconX />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Group w="100%" justify="space-between">
        <ActionIcon
          size="xl"
          onClick={() => {
            dispatch(
              updateInterests([
                ...interests,
                {
                  id: uuidv4(),
                  applicableDate: getNextDate(),
                  apr: 0,
                  compounded: getNextCompounded(),
                  aprIsVariable: false,
                  aprVariable: null,
                  applicableDateIsVariable: false,
                  applicableDateVariable: null,
                },
              ]),
            );
          }}
        >
          <IconPlus />
        </ActionIcon>
        <ActionIcon
          size="xl"
          onClick={() => {
            dispatch(updateInterests([...interests].sort((a, b) => (a.applicableDate > b.applicableDate ? 1 : -1))));
          }}
        >
          <IconSort09 />
        </ActionIcon>
        <ActionIcon
          size="xl"
          onClick={() => {
            dispatch(saveInterests(account, [], startDate, endDate, graphStartDate, graphEndDate));
            resetSelected();
          }}
        >
          <IconTrash />
        </ActionIcon>
        <ActionIcon
          disabled={!allValid()}
          size="xl"
          onClick={() => {
            dispatch(saveInterests(account, interests, startDate, endDate, graphStartDate, graphEndDate));
            resetSelected();
          }}
        >
          <IconDeviceFloppy />
        </ActionIcon>
      </Group>
    </Stack>
  );
};
