import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Group,
  NumberInput,
  Radio,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { AppDispatch } from '../../store';
import {
  selectDateRangeMode,
  selectSmartCount,
  selectSmartInterval,
  selectSmartEndCount,
  selectSmartEndInterval,
  selectCustomStartDate,
  selectCustomEndDate,
} from '../../features/spendingTracker/select';
import {
  setDateRangeMode,
  setSmartCount,
  setSmartInterval,
  setSmartEndCount,
  setSmartEndInterval,
  setCustomStartDate,
  setCustomEndDate,
} from '../../features/spendingTracker/slice';

const DateRangeControls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dateRangeMode = useSelector(selectDateRangeMode);
  const smartCount = useSelector(selectSmartCount);
  const smartInterval = useSelector(selectSmartInterval);
  const smartEndCount = useSelector(selectSmartEndCount);
  const smartEndInterval = useSelector(selectSmartEndInterval);
  const customStartDate = useSelector(selectCustomStartDate);
  const customEndDate = useSelector(selectCustomEndDate);

  return (
    <Card shadow="sm" p="md">
      <Stack gap="sm">
        <Text fw={600}>Date Range</Text>

        <Radio.Group
          value={dateRangeMode}
          onChange={(value) => dispatch(setDateRangeMode(value as 'custom' | 'smart'))}
        >
          <Group>
            <Radio value="smart" label="Smart" />
            <Radio value="custom" label="Custom" />
          </Group>
        </Radio.Group>

        {dateRangeMode === 'smart' && (
          <Stack gap="xs">
            <Group>
              <Text size="sm">Last</Text>
              <NumberInput
                value={smartCount}
                onChange={(v) => {
                  dispatch(setSmartCount(typeof v === 'number' ? v : parseInt(v) || 1));
                }}
                min={1}
                style={{ width: 80 }}
              />
              <Select
                data={[
                  { value: 'weeks', label: 'Weeks' },
                  { value: 'months', label: 'Months' },
                  { value: 'years', label: 'Years' },
                ]}
                value={smartInterval}
                onChange={(v) => {
                  if (v) dispatch(setSmartInterval(v as 'weeks' | 'months' | 'years'));
                }}
                style={{ width: 120 }}
              />
            </Group>
            <Group>
              <Text size="sm">Next</Text>
              <NumberInput
                value={smartEndCount}
                onChange={(v) => {
                  dispatch(setSmartEndCount(typeof v === 'number' ? v : parseInt(v) || 1));
                }}
                min={1}
                style={{ width: 80 }}
              />
              <Select
                data={[
                  { value: 'weeks', label: 'Weeks' },
                  { value: 'months', label: 'Months' },
                  { value: 'years', label: 'Years' },
                ]}
                value={smartEndInterval}
                onChange={(v) => {
                  if (v) dispatch(setSmartEndInterval(v as 'weeks' | 'months' | 'years'));
                }}
                style={{ width: 120 }}
              />
            </Group>
          </Stack>
        )}

        {dateRangeMode === 'custom' && (
          <Group>
            <DateInput
              label="Start Date"
              value={customStartDate ? new Date(customStartDate + 'T00:00:00') : null}
              onChange={(date) => dispatch(setCustomStartDate(date ? dayjs(date).format('YYYY-MM-DD') : null))}
              placeholder="Select date"
              size="sm"
            />
            <DateInput
              label="End Date"
              value={customEndDate ? new Date(customEndDate + 'T00:00:00') : null}
              onChange={(date) => dispatch(setCustomEndDate(date ? dayjs(date).format('YYYY-MM-DD') : null))}
              placeholder="Select date"
              size="sm"
            />
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default DateRangeControls;
