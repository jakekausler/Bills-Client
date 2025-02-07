import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBreakdownEnd,
  selectBreakdownStart,
  selectCategoryBreakdown,
  selectCategoryBreakdownLoaded,
  selectSelectedAccounts,
  selectSelectedCategory,
  selectSelectedCategoryBreakdown,
  selectSelectedCategoryBreakdownLoaded,
  selectSortedSelectedCategoryActivity,
} from '../../features/categories/select';
import { useElementAspectRatio } from '../../hooks/useElementAspectRatio';
import { useEffect, useRef, useState } from 'react';
import { Group, LoadingOverlay, Stack, Table, useMantineTheme } from '@mantine/core';
import { CategoryBreakdown } from '../../types/types';
import { Doughnut } from 'react-chartjs-2';
import { ActiveElement, Chart, ChartEvent } from 'chart.js';
import {
  loadCategoryBreakdown,
  loadSelectedCategoryActivity,
  loadSelectedCategoryBreakdown,
} from '../../features/categories/actions';
import { updateBreakdownEnd, updateBreakdownStart, updateSelectedCategory } from '../../features/categories/slice';
import { AppDispatch } from '../../store';
import { EditableDateInput } from '../helpers/editableDateInput';

export default function Categories() {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null);
  const isSkinny = useElementAspectRatio(ref);
  const [showLoading, setShowLoading] = useState(false);

  const startDate = useSelector(selectBreakdownStart);
  const endDate = useSelector(selectBreakdownEnd);
  const selectedCategory = useSelector(selectSelectedCategory);
  const rawCategoryBreakdown = useSelector(selectCategoryBreakdown);
  const rawSelectedCategoryBreakdown = useSelector(selectSelectedCategoryBreakdown);
  const selectedAccounts = useSelector(selectSelectedAccounts);

  useEffect(() => {
    dispatch(loadCategoryBreakdown(startDate, endDate, selectedAccounts));
    if (selectedCategory) {
      dispatch(loadSelectedCategoryBreakdown(selectedCategory, startDate, endDate, selectedAccounts));
      dispatch(loadSelectedCategoryActivity(selectedCategory, startDate, endDate, selectedAccounts));
    }
  }, [dispatch, startDate, endDate, selectedCategory, selectedAccounts]);

  const categoryBreakdown = formatCategoryBreakdown(rawCategoryBreakdown);
  const selectedCategoryBreakdown = selectedCategory ? formatCategoryBreakdown(rawSelectedCategoryBreakdown) : null;

  const categoryBreakdownLoaded = useSelector(selectCategoryBreakdownLoaded);
  const selectedCategoryBreakdownLoaded = useSelector(selectSelectedCategoryBreakdownLoaded);
  const selectedCategoryActivity = useSelector(selectSortedSelectedCategoryActivity);

  useEffect(() => {
    const isLoading = !categoryBreakdownLoaded || (!selectedCategoryBreakdownLoaded && selectedCategory !== '');

    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [categoryBreakdownLoaded, selectedCategoryBreakdownLoaded, selectedCategory]);

  const onCategoryClick = (_: ChartEvent, elements: ActiveElement[]) => {
    if (!elements?.length) return;
    const category = categoryBreakdown.labels[elements[0].index];
    if (category === selectedCategory) {
      dispatch(updateSelectedCategory(''));
    } else {
      dispatch(updateSelectedCategory(category));
      dispatch(loadSelectedCategoryBreakdown(category, startDate, endDate, selectedAccounts));
    }
  };

  return (
    <Stack ref={ref} w="100%" h="100%" pos="relative">
      <LoadingOverlay
        visible={showLoading}
        loaderProps={{ color: 'blue.6', size: 'xl' }}
        overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
      />
      <Group h="60px" grow>
        <EditableDateInput
          label="Start Date"
          value={startDate}
          onBlur={(value) => {
            if (!value) return;
            dispatch(updateBreakdownStart(value));
            dispatch(loadCategoryBreakdown(value, endDate, selectedAccounts));
            if (selectedCategory) {
              dispatch(loadSelectedCategoryBreakdown(selectedCategory, value, endDate, selectedAccounts));
            }
          }}
          placeholder="Start date"
        />
        <EditableDateInput
          label="End Date"
          value={endDate}
          onBlur={(value) => {
            if (!value) return;
            dispatch(updateBreakdownEnd(value));
            dispatch(loadCategoryBreakdown(startDate, value, selectedAccounts));
            if (selectedCategory) {
              dispatch(loadSelectedCategoryBreakdown(selectedCategory, startDate, value, selectedAccounts));
            }
          }}
          placeholder="End date"
        />
      </Group>
      {isSkinny && (
        <Stack mih="100%">
          <Stack h="49.5%" w="100%" justify="center">
            <CategoryChart categoryBreakdown={categoryBreakdown} onCategoryClick={onCategoryClick} />
          </Stack>
          <Stack h="49.5%" w="100%" justify="center">
            {selectedCategoryBreakdown && <CategoryChart categoryBreakdown={selectedCategoryBreakdown} />}
          </Stack>
          {selectedCategory && (
            <Stack w="100%">
              <Table
                stickyHeader
                style={{ display: 'table', width: '100%', overflow: 'auto', height: 'calc(100% - 40px)' }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Amount</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedCategoryActivity.map((activity, idx) => (
                    <Table.Tr
                      key={`${activity.date}-${activity.name}-${activity.amount}`}
                      style={{
                        borderTop:
                          idx !== 0 && activity.category !== selectedCategoryActivity[idx - 1].category
                            ? '4px solid var(--mantine-color-gray-6)'
                            : undefined,
                      }}
                    >
                      <Table.Td>{activity.date}</Table.Td>
                      <Table.Td>{activity.account}</Table.Td>
                      <Table.Td>{activity.name}</Table.Td>
                      <Table.Td>{activity.category.split('.')[1]}</Table.Td>
                      <Table.Td>{`$ ${(activity.amount as Number).toFixed(2)}`}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          )}
        </Stack>
      )}
      {!isSkinny && (
        <Stack w="100%" h="calc(100% - 60px)">
          <Group w="100%" justify="space-between" h="50%">
            <Stack w="49%" h="100%">
              <CategoryChart categoryBreakdown={categoryBreakdown} onCategoryClick={onCategoryClick} />
            </Stack>
            <Stack w="49%" h="100%">
              {selectedCategoryBreakdown && (
                <CategoryChart selectedCategory={selectedCategory} categoryBreakdown={selectedCategoryBreakdown} />
              )}
            </Stack>
          </Group>
          {selectedCategory && (
            <Stack w="100%" h="50%" style={{ overflow: 'auto' }}>
              <Table
                stickyHeader
                style={{ display: 'table', width: '100%', overflow: 'auto', height: 'calc(100% - 40px)' }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Amount</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedCategoryActivity.map((activity, idx) => (
                    <Table.Tr
                      key={`${activity.date}-${activity.name}-${activity.amount}`}
                      style={{
                        borderTop:
                          idx !== 0 && activity.category !== selectedCategoryActivity[idx - 1].category
                            ? '4px solid var(--mantine-color-gray-6)'
                            : undefined,
                      }}
                    >
                      <Table.Td>{activity.date}</Table.Td>
                      <Table.Td>{activity.account}</Table.Td>
                      <Table.Td>{activity.name}</Table.Td>
                      <Table.Td>{activity.category.split('.')[1]}</Table.Td>
                      <Table.Td>{`$ ${(activity.amount as Number).toFixed(2)}`}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
  }[];
};

function formatCategoryBreakdown(categoryBreakdown: CategoryBreakdown): ChartData {
  // Create array of [label, value] pairs and sort by absolute value
  const entries = Object.entries(categoryBreakdown).sort(([, a], [, b]) => b - a);

  // Split back into labels and values
  const labels = entries.map(([label]) => label);
  const values = entries.map(([, value]) => value);

  return {
    labels,
    datasets: [
      {
        data: values,
      },
    ],
  };
}

function CategoryChart({
  categoryBreakdown,
  onCategoryClick,
  selectedCategory,
}: {
  categoryBreakdown: ChartData;
  onCategoryClick?: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => void;
  selectedCategory?: string;
}) {
  const theme = useMantineTheme();

  const colors = [
    theme.colors.red[5],
    theme.colors.violet[5],
    theme.colors.cyan[5],
    theme.colors.lime[5],
    theme.colors.pink[5],
    theme.colors.indigo[5],
    theme.colors.teal[5],
    theme.colors.yellow[5],
    theme.colors.grape[5],
    theme.colors.blue[5],
    theme.colors.green[5],
    theme.colors.orange[5],
  ];

  const chartData = {
    ...categoryBreakdown,
    datasets: [
      {
        ...categoryBreakdown.datasets[0],
        backgroundColor: colors.slice(0, categoryBreakdown.labels.length),
        borderColor: theme.colors.dark[0],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Stack h="100%" w="100%" justify="center" align="center">
      <Doughnut
        data={chartData}
        options={{
          onClick: onCategoryClick,
          plugins: {
            title: {
              display: true,
              text: selectedCategory ? `${selectedCategory} Breakdown` : 'Spending Breakdown',
              color: theme.colors.dark[0],
            },
            legend: {
              labels: {
                color: theme.colors.dark[0],
              },
            },
          },
        }}
      />
    </Stack>
  );
}
