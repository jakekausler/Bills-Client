import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectBills, selectBillsLoaded, selectStartDate } from '../../features/calendar/select';
import { useEffect, useState } from 'react';
import { loadCalendar } from '../../features/calendar/actions';
import { Calendar as BigCalendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import './calendar.css';
import { CalendarEvent } from './calendarEvent';
import { ActionIcon, Group, LoadingOverlay, Stack } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { toDateString } from '../../utils/date';
import { updateEndDate } from '../../features/calendar/slice';
import { updateStartDate } from '../../features/calendar/slice';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
dayjs.extend(utc);
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
    const dispatch = useDispatch();
    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        const isLoading = !loaded;
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoading(true);
            }, 50);
            return () => clearTimeout(timer);
        }
        else {
            setShowLoading(false);
        }
    }, [loaded]);
    const getEventStyle = (event) => {
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
    return (React.createElement(Stack, { h: "100%", pos: "relative" },
        React.createElement(Group, { justify: "center", grow: true },
            React.createElement(ActionIcon, { disabled: !loaded, onClick: () => {
                    dispatch(updateStartDate(dayjs.utc(startDate).subtract(1, 'month').format('YYYY-MM-DD')));
                    dispatch(updateEndDate(dayjs.utc(startDate).subtract(1, 'month').endOf('month').format('YYYY-MM-DD')));
                    dispatch(loadCalendar());
                } },
                React.createElement(IconChevronLeft, null)),
            React.createElement(MonthPickerInput, { disabled: !loaded, value: new Date(`${startDate}T00:00:00`), onChange: (value) => {
                    if (value) {
                        dispatch(updateStartDate(toDateString(value)));
                        dispatch(updateEndDate(dayjs.utc(value).endOf('month').format('YYYY-MM-DD')));
                        dispatch(loadCalendar());
                    }
                }, placeholder: "Pick month", mx: "auto", maw: 400, styles: {
                    input: {
                        textAlign: 'center',
                    },
                } }),
            React.createElement(ActionIcon, { disabled: !loaded, onClick: () => {
                    dispatch(updateStartDate(dayjs.utc(startDate).add(1, 'month').format('YYYY-MM-DD')));
                    dispatch(updateEndDate(dayjs.utc(startDate).add(1, 'month').endOf('month').format('YYYY-MM-DD')));
                    dispatch(loadCalendar());
                } },
                React.createElement(IconChevronRight, null))),
        React.createElement(Stack, { h: "100%", pos: "relative" },
            React.createElement(LoadingOverlay, { visible: showLoading, loaderProps: { color: 'blue.6', size: 'xl' }, overlayProps: { blur: 1, opacity: 1, zIndex: 1000 } }),
            React.createElement(BigCalendar, { localizer: dayjsLocalizer(dayjs), events: bills, views: [Views.MONTH], view: view, onView: () => { }, onNavigate: () => { }, date: new Date(`${startDate}T00:00:00`), selectable: true, showAllEvents: true, defaultView: view, eventPropGetter: getEventStyle, toolbar: false, components: components }))));
}
