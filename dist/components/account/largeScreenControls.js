import React from 'react';
import { Button, Group } from '@mantine/core';
import { newActivity, newBill, setEndDate, setStartDate } from '../../features/activities/slice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectEndDate } from '../../features/activities/select';
import { selectStartDate } from '../../features/activities/select';
import { loadInterests } from '../../features/activities/actions';
import { selectSelectedAccount } from '../../features/accounts/select';
import { EditableDateInput } from '../helpers/editableDateInput';
export default function LargeScreenControls({ visibleFrom, hiddenFrom, style, h, }) {
    const accountId = useSelector(selectSelectedAccount)?.id;
    const startDate = useSelector(selectStartDate);
    const endDate = useSelector(selectEndDate);
    const dispatch = useDispatch();
    return (React.createElement(Group, { visibleFrom: visibleFrom, hiddenFrom: hiddenFrom, w: "100%", h: h, grow: true, align: "end", style: style },
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
        React.createElement(Button, { onClick: () => {
                dispatch(newActivity());
            } }, "+ Activity"),
        React.createElement(Button, { onClick: () => {
                dispatch(newBill());
            } }, "+ Bill"),
        React.createElement(Button, { onClick: () => {
                if (!accountId)
                    return;
                dispatch(loadInterests(accountId));
            } }, "+ Interest")));
}
