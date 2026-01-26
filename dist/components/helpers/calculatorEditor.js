import React from 'react';
import { ActionIcon, Button, Popover, Table, TextInput } from '@mantine/core';
import { IconCalculator } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
const calculate = (a, b, operation) => {
    switch (operation) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
        default:
            return b;
    }
};
export function CalculatorEditor({ handleEnter, ...restProps }) {
    const [opened, setOpened] = useState(false);
    const [currentOperation, setCurrentOperation] = useState(null);
    const [firstOperand, setFirstOperand] = useState(null);
    const [displayValue, setDisplayValue] = useState(null);
    useEffect(() => {
        setDisplayValue(restProps.value?.toString() || null);
    }, [restProps.value]);
    const handleOperation = (operation) => {
        if (firstOperand === null) {
            setFirstOperand(Number(displayValue || restProps.value));
            setCurrentOperation(operation);
            setDisplayValue(operation);
            setOpened(true);
        }
    };
    const handleNumber = (number) => {
        const input = document.activeElement;
        const selectionStart = input?.selectionStart || 0;
        const selectionEnd = input?.selectionEnd || 0;
        setDisplayValue((prev) => {
            if (!prev)
                return number;
            // If there's selected text, replace it with the new number
            if (selectionStart !== selectionEnd) {
                const newValue = prev.slice(0, selectionStart) + number + prev.slice(selectionEnd);
                setTimeout(() => {
                    input?.setSelectionRange(selectionStart + number.length, selectionStart + number.length);
                }, 0);
                return newValue;
            }
            // Insert the number at cursor position
            const newValue = prev.slice(0, selectionStart) + number + prev.slice(selectionStart);
            setTimeout(() => {
                input?.setSelectionRange(selectionStart + number.length, selectionStart + number.length);
            }, 0);
            return newValue;
        });
    };
    const stripOperand = (operand) => {
        return operand.toString().replace(/[+\-*/]/g, '');
    };
    const handleEqual = () => {
        if (firstOperand !== null &&
            currentOperation !== null &&
            (displayValue !== null || restProps.value !== undefined)) {
            const secondOperand = Number(stripOperand(displayValue || restProps.value));
            const result = calculate(firstOperand, secondOperand, currentOperation);
            if (isNaN(result))
                return;
            restProps.onChange?.(Math.round(result * 100) / 100);
            setOpened(false);
            setFirstOperand(null);
            setCurrentOperation(null);
            setDisplayValue(null);
        }
    };
    const handleBackspace = (event) => {
        const input = event.currentTarget;
        const selectionStart = input.selectionStart || 0;
        const selectionEnd = input.selectionEnd || 0;
        setDisplayValue((prev) => {
            if (!prev)
                return null;
            // If there's selected text, delete the selection
            if (selectionStart !== selectionEnd) {
                const newValue = prev.slice(0, selectionStart) + prev.slice(selectionEnd);
                setTimeout(() => {
                    input.setSelectionRange(selectionStart, selectionStart);
                }, 0);
                return newValue;
            }
            // Otherwise handle single character deletion
            if (selectionStart === 0)
                return prev;
            const newValue = prev.slice(0, selectionStart - 1) + prev.slice(selectionStart);
            setTimeout(() => {
                input.setSelectionRange(selectionStart - 1, selectionStart - 1);
            }, 0);
            return newValue;
        });
    };
    const handleDelete = (event) => {
        const input = event.currentTarget;
        const selectionStart = input.selectionStart || 0;
        const selectionEnd = input.selectionEnd || 0;
        setDisplayValue((prev) => {
            if (!prev)
                return null;
            // If there's selected text, delete the selection
            if (selectionStart !== selectionEnd) {
                const newValue = prev.slice(0, selectionStart) + prev.slice(selectionEnd);
                setTimeout(() => {
                    input.setSelectionRange(selectionStart, selectionStart);
                }, 0);
                return newValue;
            }
            // Otherwise handle single character deletion
            if (selectionStart === prev.length)
                return prev;
            const newValue = prev.slice(0, selectionStart) + prev.slice(selectionStart + 1);
            setTimeout(() => {
                input.setSelectionRange(selectionStart, selectionStart);
            }, 0);
            return newValue;
        });
    };
    const onBeforeInput = (event) => {
        const key = event.data;
        const input = event.currentTarget;
        const selectionStart = input.selectionStart || 0;
        const selectionEnd = input.selectionEnd || 0;
        const isFullySelected = selectionStart === 0 && selectionEnd === input.value.length;
        const isEmpty = !displayValue;
        const isZero = displayValue === '0';
        // Special case for negative numbers
        if (key === '-' && (isFullySelected || isEmpty || isZero)) {
            event.preventDefault();
            setDisplayValue('-');
            return;
        }
        // Handle operations
        if (['+', '-', '*', '/'].includes(key)) {
            event.preventDefault();
            handleOperation(key);
            return;
        }
        if (key === '=') {
            event.preventDefault();
            handleEqual();
            return;
        }
        // Handle numbers - only prevent default for calculator button input
        // Let normal typing through to trigger onChange/onInput
        if (key.match(/^[0-9.]$/)) {
            // Only handle via calculator if we're adding at the end or it's an operation context
            const input = event.currentTarget;
            const selectionStart = input.selectionStart || 0;
            const selectionEnd = input.selectionEnd || 0;
            const isAtEnd = selectionStart === input.value.length && selectionEnd === input.value.length;
            if (isAtEnd || isEmpty || isZero || isFullySelected) {
                event.preventDefault();
                handleNumber(key);
                return;
            }
            // Otherwise let normal typing happen
            return;
        }
        // Only prevent default for non-standard input
        if (!key.match(/^[0-9.\-]$/)) {
            event.preventDefault();
        }
    };
    const onKeyDown = (event) => {
        const key = event.key;
        if (key === 'Enter') {
            event.preventDefault();
            // Check if displayValue is just a minus sign - flip the sign of the original value
            if (displayValue === '-') {
                const flippedValue = -(restProps.value || 0);
                restProps.onChange?.(flippedValue);
                // Reset calculator state completely
                setDisplayValue(null);
                setFirstOperand(null);
                setCurrentOperation(null);
                return;
            }
            // Only handle Enter if we're in the middle of a calculation
            if (firstOperand !== null &&
                currentOperation !== null &&
                (displayValue !== null || restProps.value !== undefined)) {
                handleEqual();
                return;
            }
            // Otherwise, update the value and then call handleEnter
            const currentValue = Number(displayValue ?? restProps.value);
            restProps.onChange?.(currentValue);
            handleEnter?.(currentValue);
        }
        if (key === 'Tab') {
            restProps.onChange?.(Number(displayValue || restProps.value));
            return;
        }
        if (key === 'Backspace') {
            // Only use custom handling if we're in calculator mode or at special positions
            const input = event.currentTarget;
            const selectionStart = input.selectionStart || 0;
            const selectionEnd = input.selectionEnd || 0;
            const hasSelection = selectionStart !== selectionEnd;
            const isAtEnd = selectionStart === input.value.length;
            // Use custom handling for calculator operations or when deleting at the end
            if ((displayValue !== null && currentOperation !== null) || (isAtEnd && !hasSelection)) {
                event.preventDefault();
                handleBackspace(event);
                return;
            }
            // Otherwise let normal deletion happen
            return;
        }
        if (key === 'Delete') {
            // Only use custom handling if we're in calculator mode
            if (displayValue !== null && currentOperation !== null) {
                event.preventDefault();
                handleDelete(event);
                return;
            }
            // Otherwise let normal deletion happen
            return;
        }
        if (key === 'ArrowUp' ||
            key === 'ArrowDown' ||
            key === 'ArrowLeft' ||
            key === 'ArrowRight' ||
            key === 'Home' ||
            key === 'End') {
            return;
        }
        // Handle select all (Ctrl/Cmd + A)
        if ((event.ctrlKey || event.metaKey) && key === 'a') {
            event.preventDefault();
            event.currentTarget.select();
            return;
        }
        // Allow copy/paste/cut operations
        if ((event.ctrlKey || event.metaKey) && (key === 'c' || key === 'v' || key === 'x')) {
            return;
        }
        return;
    };
    return (React.createElement(Popover, { opened: opened, onChange: setOpened, position: "bottom-start", offset: 5, width: "target" },
        React.createElement(Popover.Target, null,
            React.createElement(TextInput, { ...restProps, onChange: (event) => {
                    const value = event.target.value;
                    setDisplayValue(value);
                    restProps.onChange?.(value === '' ? 0 : Number(value));
                }, value: displayValue ?? restProps.value?.toString() ?? '', rightSection: React.createElement(ActionIcon, { onClick: () => setOpened((o) => !o) },
                    React.createElement(IconCalculator, { size: "1.1rem" })), onBeforeInput: onBeforeInput, onKeyDown: onKeyDown, onInput: (event) => {
                    // Sync displayValue with actual input value when it changes
                    const value = event.target.value;
                    setDisplayValue(value);
                }, onBlur: () => {
                    restProps.onChange?.(Number(displayValue ?? restProps.value ?? 0));
                    setOpened(false);
                } })),
        opened && (React.createElement(Popover.Dropdown, { p: "xs" },
            React.createElement(Table, { verticalSpacing: 2, horizontalSpacing: 2, withRowBorders: false },
                React.createElement(Table.Tbody, null,
                    React.createElement(Table.Tr, null, ['7', '8', '9', '+'].map((value) => (React.createElement(Table.Td, { key: value },
                        React.createElement(Button, { onClick: () => (value === '+' ? handleOperation('+') : handleNumber(value)), p: 0, w: "30px", h: "30px" }, value))))),
                    React.createElement(Table.Tr, null, ['4', '5', '6', '-'].map((value) => (React.createElement(Table.Td, { key: value },
                        React.createElement(Button, { onClick: () => (value === '-' ? handleOperation('-') : handleNumber(value)), p: 0, w: "30px", h: "30px" }, value))))),
                    React.createElement(Table.Tr, null, ['1', '2', '3', '*'].map((value) => (React.createElement(Table.Td, { key: value },
                        React.createElement(Button, { onClick: () => (value === '*' ? handleOperation('*') : handleNumber(value)), p: 0, w: "30px", h: "30px" }, value))))),
                    React.createElement(Table.Tr, null, ['0', '.', '=', '/'].map((value) => (React.createElement(Table.Td, { key: value },
                        React.createElement(Button, { onClick: () => {
                                if (value === '=') {
                                    handleEqual();
                                }
                                else if (value === '/') {
                                    handleOperation('/');
                                }
                                else {
                                    handleNumber(value);
                                }
                            }, p: 0, w: "30px", h: "30px" }, value)))))))))));
}
