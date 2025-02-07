import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectBills, selectBillsLoaded, selectStartDate } from '../../features/calendar/select';
import { useEffect, useState } from 'react';
import { loadCalendar } from '../../features/calendar/actions';
import { AppDispatch } from '../../store';
import { Calendar as BigCalendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import './calendar.css';
import { CalendarEvent } from './calendarEvent';
import { ActionIcon, Group, LoadingOverlay, Stack } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { toDateString } from '../../utils/date';
import { updateEndDate } from '../../features/calendar/slice';
import { updateStartDate } from '../../features/calendar/slice';
import { CalendarBill } from '../../types/types';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function BillCalendar() {
  const startDate = useSelector(selectStartDate);
  const [view, _setView] = useState(Views.MONTH);
  const bills = useSelector(selectBills).map((bill) => ({
    ...bill,
    start: new Date(`${bill.date}T00:00:00`),
    end: new Date(`${bill.date}T00:00:00`),
    title: `${bill.name} \$${(bill.isTransfer ? Math.abs(bill.amount) : bill.amount).toFixed(2)}`,
    allDay: true,
  }));
  const loaded = useSelector(selectBillsLoaded);

  const dispatch = useDispatch<AppDispatch>();

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const isLoading = !loaded;
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [loaded]);

  const getEventStyle = (event: CalendarBill) => {
    // Get the calendar container width
    const calendarElement = document.querySelector('.rbc-calendar');
    const containerWidth = calendarElement?.clientWidth || 800; // fallback to 800 if not found

    const baseFontSize = containerWidth * 0.012; // 1.2% of container width
    const minFontSize = 8;
    const maxFontSize = 14;
    const fontSize = Math.min(Math.max(baseFontSize, minFontSize), maxFontSize);

    const style = {
      backgroundColor: event.isTransfer ? '#9999ff' : event.amount < 0 ? '#ff9999' : '#99ff99',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
      fontSize: `${fontSize}px`,
    };
    return {
      style,
    };
  };

  const components = {
    event: CalendarEvent,
  };

  return (
    <Stack h="100%" pos="relative">
      <Group justify="center" grow>
        <ActionIcon
          disabled={!loaded}
          onClick={() => {
            dispatch(updateStartDate(dayjs(startDate).subtract(1, 'month').format('YYYY-MM-DD')));
            dispatch(updateEndDate(dayjs(startDate).subtract(1, 'month').endOf('month').format('YYYY-MM-DD')));
            dispatch(loadCalendar());
          }}
        >
          <IconChevronLeft />
        </ActionIcon>
        <MonthPickerInput
          disabled={!loaded}
          value={new Date(`${startDate}T00:00:00`)}
          onChange={(value) => {
            if (value) {
              dispatch(updateStartDate(toDateString(value)));
              dispatch(updateEndDate(dayjs(value).endOf('month').format('YYYY-MM-DD')));
              dispatch(loadCalendar());
            }
          }}
          placeholder="Pick month"
          mx="auto"
          maw={400}
          styles={{
            input: {
              textAlign: 'center',
            },
          }}
        />
        <ActionIcon
          disabled={!loaded}
          onClick={() => {
            dispatch(updateStartDate(dayjs(startDate).add(1, 'month').format('YYYY-MM-DD')));
            dispatch(updateEndDate(dayjs(startDate).add(1, 'month').endOf('month').format('YYYY-MM-DD')));
            dispatch(loadCalendar());
          }}
        >
          <IconChevronRight />
        </ActionIcon>
      </Group>
      <Stack h="100%" pos="relative">
        <LoadingOverlay
          visible={showLoading}
          loaderProps={{ color: 'blue.6', size: 'xl' }}
          overlayProps={{ blur: 1, opacity: 1, zIndex: 1000 }}
        />
        <BigCalendar
          localizer={dayjsLocalizer(dayjs)}
          events={bills}
          views={[Views.MONTH]}
          view={view}
          onView={() => {}}
          onNavigate={() => {}}
          date={new Date(`${startDate}T00:00:00`)}
          selectable
          showAllEvents={true}
          defaultView={view}
          eventPropGetter={getEventStyle}
          toolbar={false}
          components={components}
        />
      </Stack>
    </Stack>
  );
}
