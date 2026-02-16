import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Group,
  Loader,
  Modal,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { IconAlertCircle, IconPlus, IconTrash } from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { AppDispatch } from '../../store';
import {
  selectSpendingTrackerCategories,
  selectSelectedCategoryId,
  selectSelectedCategory,
  selectSpendingTrackerLoading,
  selectSpendingTrackerError,
  selectChartData,
  selectChartLoading,
  selectDateRangeMode,
  selectSmartCount,
  selectSmartInterval,
  selectSmartEndCount,
  selectSmartEndInterval,
  selectCustomStartDate,
  selectCustomEndDate,
} from '../../features/spendingTracker/select';
import { setSelectedCategoryId, clearError } from '../../features/spendingTracker/slice';
import { createCategory, deleteCategory, loadChartData } from '../../features/spendingTracker/actions';
import { selectAllAccounts } from '../../features/accounts/select';
import { SpendingTrackerCategory } from '../../types/types';
import ConfigCard from './configCard';
import DateRangeControls from './dateRangeControls';
import SpendingChart from './spendingChart';

export default function SpendingTracker() {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectSpendingTrackerCategories);
  const selectedCategoryId = useSelector(selectSelectedCategoryId);
  const selectedCategory = useSelector(selectSelectedCategory);
  const loading = useSelector(selectSpendingTrackerLoading);
  const error = useSelector(selectSpendingTrackerError);
  const accounts = useSelector(selectAllAccounts);
  const chartData = useSelector(selectChartData);
  const chartLoading = useSelector(selectChartLoading);
  const dateRangeMode = useSelector(selectDateRangeMode);
  const smartCount = useSelector(selectSmartCount);
  const smartInterval = useSelector(selectSmartInterval);
  const smartEndCount = useSelector(selectSmartEndCount);
  const smartEndInterval = useSelector(selectSmartEndInterval);
  const customStartDate = useSelector(selectCustomStartDate);
  const customEndDate = useSelector(selectCustomEndDate);

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  // Auto-select first category when categories load and none is selected
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      dispatch(setSelectedCategoryId(categories[0].id));
    }
  }, [categories, selectedCategoryId, dispatch]);

  // Load chart data when category or date range changes (debounced)
  useEffect(() => {
    if (!selectedCategoryId) return;

    let startDate: string;
    let endDate: string;

    if (dateRangeMode === 'smart') {
      startDate = dayjs().subtract(smartCount, smartInterval).format('YYYY-MM-DD');
      endDate = dayjs().add(smartEndCount, smartEndInterval).format('YYYY-MM-DD');
    } else {
      if (!customStartDate || !customEndDate) return;
      startDate = customStartDate;
      endDate = customEndDate;
    }

    const timer = setTimeout(() => {
      dispatch(loadChartData(selectedCategoryId, startDate, endDate));
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategoryId, dateRangeMode, smartCount, smartInterval, smartEndCount, smartEndInterval, customStartDate, customEndDate, dispatch]);

  const handleCategoryChange = (value: string | null) => {
    dispatch(setSelectedCategoryId(value));
  };

  const handleAddCategory = async () => {
    const firstAccountId = accounts.length > 0 ? accounts[0].id : '';
    const defaults: Omit<SpendingTrackerCategory, 'id'> = {
      name: 'New Category',
      threshold: 0,
      interval: 'weekly',
      intervalStart: 'Saturday',
      carryOver: false,
      carryUnder: false,
      increaseBy: 0,
      increaseByIsVariable: false,
      increaseByVariable: null,
      thresholdIsVariable: false,
      thresholdVariable: null,
      increaseByDate: '01/01',
      thresholdChanges: [],
      accountId: firstAccountId,
      startDate: null,
    };

    try {
      const newCategory = await dispatch(createCategory(defaults)) as SpendingTrackerCategory;
      if (newCategory?.id) {
        dispatch(setSelectedCategoryId(newCategory.id));
      }
    } catch {
      // Error is handled by the Redux action
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategoryId) return;

    try {
      await dispatch(deleteCategory(selectedCategoryId));
      setDeleteModalOpened(false);
      // After deletion, the slice clears selectedCategoryId.
      // The useEffect above will auto-select the first remaining category.
    } catch {
      setDeleteModalOpened(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpened(false);
  };

  const dropdownOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  if (loading && categories.length === 0) {
    return (
      <Container size="xl" py="md">
        <Group justify="center" py="xl">
          <Loader size="sm" />
          <Text c="dimmed">Loading spending tracker categories...</Text>
        </Group>
      </Container>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <Container size="xl" py="md">
        <Stack align="center" justify="center" gap="md" py="xl">
          <Text size="lg" c="dimmed">
            No spending categories configured
          </Text>
          <Button leftSection={<IconPlus size={16} />} onClick={handleAddCategory}>
            Create Category
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            withCloseButton
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}
        <Group>
          <Select
            data={dropdownOptions}
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            placeholder="Select a category"
            style={{ flex: 1, maxWidth: 300 }}
          />
          <Button leftSection={<IconPlus size={16} />} variant="light" onClick={handleAddCategory}>
            Add New
          </Button>
          <Button
            leftSection={<IconTrash size={16} />}
            variant="light"
            color="red"
            onClick={handleDeleteClick}
            disabled={!selectedCategoryId}
          >
            Delete Category
          </Button>
        </Group>

        {selectedCategory && <ConfigCard />}

        {selectedCategory && <DateRangeControls />}
        {selectedCategory && <SpendingChart chartData={chartData} loading={chartLoading} />}
      </Stack>

      <Modal
        opened={deleteModalOpened}
        onClose={cancelDelete}
        title="Delete Spending Category"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete <strong>"{selectedCategory?.name}"</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            This action cannot be undone. All associated data will be permanently removed.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
