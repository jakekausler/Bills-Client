import React from 'react';
import { ActionIcon, Button, Group, Modal, Stack } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { toggleGraph } from '../../features/graph/slice';
import { useDisclosure } from '@mantine/hooks';
import { selectEndDate, selectStartDate } from '../../features/activities/select';
import { newActivity, newBill, setEndDate, setStartDate } from '../../features/activities/slice';
import { loadInterests } from '../../features/activities/actions';
import { selectSelectedAccount } from '../../features/accounts/select';
import { EditableDateInput } from '../helpers/editableDateInput';
import { IconActivity, IconCalendar, IconClockDollar, IconCurrencyDollar, IconPercentage } from '@tabler/icons-react';
export default function SmallScreenControls({ visibleFrom, hiddenFrom, style, h, }) {
    const dispatch = useDispatch();
    const [opened, { open, close }] = useDisclosure();
    const startDate = useSelector(selectStartDate);
    const endDate = useSelector(selectEndDate);
    const accountId = useSelector(selectSelectedAccount)?.id;
    return (React.createElement(React.Fragment, null,
        React.createElement(Group, { visibleFrom: visibleFrom, hiddenFrom: hiddenFrom, w: "100%", h: h, preventGrowOverflow: false, grow: true, style: style },
            React.createElement(ActionIcon, { onClick: open },
                React.createElement(IconCalendar, null)),
            React.createElement(ActionIcon, { onClick: () => dispatch(newActivity()) },
                React.createElement(IconCurrencyDollar, null)),
            React.createElement(ActionIcon, { onClick: () => {
                    dispatch(newBill());
                } },
                React.createElement(IconClockDollar, null)),
            React.createElement(ActionIcon, { onClick: () => {
                    if (!accountId)
                        return;
                    dispatch(loadInterests(accountId));
                } },
                React.createElement(IconPercentage, null)),
            React.createElement(ActionIcon, { onClick: () => dispatch(toggleGraph()) },
                React.createElement(IconActivity, null))),
        React.createElement(Modal, { opened: opened, title: "Select Dates", onClose: close },
            React.createElement(Stack, null,
                React.createElement(EditableDateInput, { label: "Start date", value: startDate, onBlur: (value) => {
                        if (!value)
                            return;
                        dispatch(setStartDate(value));
                    }, placeholder: "Start date" }),
                React.createElement(EditableDateInput, { label: "End date", value: endDate, onBlur: (value) => {
                        if (!value)
                            return;
                        dispatch(setEndDate(value));
                    }, placeholder: "End date" }),
                React.createElement(Button, { onClick: close }, "Close")))));
}
