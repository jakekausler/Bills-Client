import 'react-big-calendar/lib/css/react-big-calendar.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectBills, selectBillsLoaded, selectStartDate } from '../../features/calendar/select';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';
import { useRef, useState } from 'react';
import { loadCalendar } from '../../features/calendar/actions';
import { AppDispatch } from '../../store';
import { Calendar as BigCalendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import './calendar.css';
import { CalendarEvent } from './calendarEvent';
import { ActionIcon, Button, Group, LoadingOverlay, Popover, Stack } from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import { toDateString } from '../../utils/date';
import { updateEndDate } from '../../features/calendar/slice';
import { updateStartDate } from '../../features/calendar/slice';
import { CalendarBill } from '../../types/types';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

dayjs.extend(utc);

export default function BillCalendar() {
  const startDate = useSelector(selectStartDate);
  const [view, _setView] = useState(Views.MONTH);
  const [monthPickerOpened, setMonthPickerOpened] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const bills = useSelector(selectBills).map((bill) => ({
    ...bill,
    start: new Date(`${bill.date}T00:00:00`),
    end: new Date(`${bill.date}T00:00:00`),
    title: `${bill.name} $${(bill.isTransfer ? Math.abs(bill.amount) : bill.amount).toFixed(2)}`,
    allDay: true,
  }));
  const loaded = useSelector(selectBillsLoaded);

  const dispatch = useDispatch<AppDispatch>();

  const showLoading = useDelayedLoading(!loaded, 50);

  const containerWidth = calendarContainerRef.current?.clientWidth || 800;

  const getEventStyle = (event: CalendarBill) => {
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
            dispatch(updateStartDate(dayjs.utc(startDate).subtract(1, 'month').format('YYYY-MM-DD')));
            dispatch(updateEndDate(dayjs.utc(startDate).subtract(1, 'month').endOf('month').format('YYYY-MM-DD')));
            dispatch(loadCalendar());
          }}
          aria-label="Previous month"
        >
          <IconChevronLeft />
        </ActionIcon>
        <Popover position="bottom" withArrow opened={monthPickerOpened} onChange={setMonthPickerOpened}>
          <Popover.Target>
            <Button
              disabled={!loaded}
              variant="subtle"
              mx="auto"
              maw={400}
              fullWidth
              onClick={() => setMonthPickerOpened((o) => !o)}
              styles={{ label: { textAlign: 'center' } }}
            >
              {dayjs.utc(startDate).format('MMMM YYYY')}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <MonthPicker
              value={new Date(`${startDate}T00:00:00`)}
              onChange={(value) => {
                if (value) {
                  dispatch(updateStartDate(toDateString(value)));
                  dispatch(updateEndDate(dayjs.utc(value).endOf('month').format('YYYY-MM-DD')));
                  dispatch(loadCalendar());
                  setMonthPickerOpened(false);
                }
              }}
            />
          </Popover.Dropdown>
        </Popover>
        <ActionIcon
          disabled={!loaded}
          onClick={() => {
            dispatch(updateStartDate(dayjs.utc(startDate).add(1, 'month').format('YYYY-MM-DD')));
            dispatch(updateEndDate(dayjs.utc(startDate).add(1, 'month').endOf('month').format('YYYY-MM-DD')));
            dispatch(loadCalendar());
          }}
          aria-label="Next month"
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
        <div ref={calendarContainerRef} style={{ height: '100%' }} aria-label="Bill calendar showing scheduled bills and transactions for the selected month" role="region">
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
        </div>
      </Stack>
    </Stack>
  );
}
