import React from 'react';
import { ActionIcon, Button, Popover, Table, TextInput } from '@mantine/core';
import { IconCalculator } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

type CalculatorEditorProps = {
  value: number;
  onChange: (value: number) => void;
  handleEnter?: (amount?: number) => void;
  style?: React.CSSProperties;
  error?: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

type Operation = '+' | '-' | '*' | '/';

const calculate = (a: number, b: number, operation: Operation) => {
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

export function CalculatorEditor({ handleEnter, ...restProps }: CalculatorEditorProps) {
  const [opened, setOpened] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<Operation | null>(null);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string | null>(null);

  useEffect(() => {
    setDisplayValue(restProps.value?.toString() || null);
  }, [restProps.value]);

  const handleOperation = (operation: Operation) => {
    if (firstOperand === null) {
      setFirstOperand(Number(displayValue || restProps.value));
      setCurrentOperation(operation);
      setDisplayValue(operation);
      setOpened(true);
    }
  };

  const handleNumber = (number: string) => {
    const input = document.activeElement as HTMLInputElement;
    const selectionStart = input?.selectionStart || 0;
    const selectionEnd = input?.selectionEnd || 0;

    setDisplayValue((prev) => {
      if (!prev) return number;

      // If there's selected text, replace it with the new number
      if (selectionStart !== selectionEnd) {
        const newValue = prev.slice(0, selectionStart) + number + prev.slice(selectionEnd);
        setTimeout(() => {
          input?.setSelectionRange(selectionStart + 1, selectionStart + 1);
        }, 0);
        return newValue;
      }

      // Otherwise append the number
      const newValue = prev + number;
      setTimeout(() => {
        input?.setSelectionRange(selectionStart + 1, selectionStart + 1);
      }, 0);
      return newValue;
    });
  };

  const stripOperand = (operand: string | number) => {
    return operand.toString().replace(/[+\-*/]/g, '');
  };

  const handleEqual = () => {
    if (
      firstOperand !== null &&
      currentOperation !== null &&
      (displayValue !== null || restProps.value !== undefined)
    ) {
      const secondOperand = Number(stripOperand(displayValue || restProps.value));
      const result = calculate(firstOperand, secondOperand, currentOperation);
      if (isNaN(result)) return;
      restProps.onChange?.(Math.round(result * 100) / 100);
      setOpened(false);
      setFirstOperand(null);
      setCurrentOperation(null);
      setDisplayValue(null);
    }
  };

  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    setDisplayValue((prev) => {
      if (!prev) return null;

      // If there's selected text, delete the selection
      if (selectionStart !== selectionEnd) {
        const newValue = prev.slice(0, selectionStart) + prev.slice(selectionEnd);
        setTimeout(() => {
          input.setSelectionRange(selectionStart, selectionStart);
        }, 0);
        return newValue;
      }

      // Otherwise handle single character deletion
      if (selectionStart === 0) return prev;
      const newValue = prev.slice(0, selectionStart - 1) + prev.slice(selectionStart);
      setTimeout(() => {
        input.setSelectionRange(selectionStart - 1, selectionStart - 1);
      }, 0);
      return newValue;
    });
  };

  const handleDelete = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    setDisplayValue((prev) => {
      if (!prev) return null;

      // If there's selected text, delete the selection
      if (selectionStart !== selectionEnd) {
        const newValue = prev.slice(0, selectionStart) + prev.slice(selectionEnd);
        setTimeout(() => {
          input.setSelectionRange(selectionStart, selectionStart);
        }, 0);
        return newValue;
      }

      // Otherwise handle single character deletion
      if (selectionStart === prev.length) return prev;
      const newValue = prev.slice(0, selectionStart) + prev.slice(selectionStart + 1);
      setTimeout(() => {
        input.setSelectionRange(selectionStart, selectionStart);
      }, 0);
      return newValue;
    });
  };

  const onBeforeInput = (event: React.FormEvent<HTMLInputElement> & { data: string }) => {
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
      handleOperation(key as Operation);
      return;
    }

    if (key === '=') {
      event.preventDefault();
      handleEqual();
      return;
    }

    // Handle numbers
    if (key.match(/^\d*\.?\d*$/)) {
      event.preventDefault();
      handleNumber(key);
      return;
    }

    event.preventDefault();
    return;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;

    if (key === 'Enter') {
      // Only handle Enter if we're in the middle of a calculation
      if (
        firstOperand !== null &&
        currentOperation !== null &&
        (displayValue !== null || restProps.value !== undefined)
      ) {
        event.preventDefault();
        handleEqual();
        return;
      }
      // Otherwise, update the value and then call handleEnter
      event.preventDefault();
      restProps.onChange?.(Number(displayValue || restProps.value));
      handleEnter?.(Number(displayValue || restProps.value));
    }

    if (key === 'Tab') {
      restProps.onChange?.(Number(displayValue || restProps.value));
      return;
    }

    if (key === 'Backspace') {
      event.preventDefault();
      handleBackspace(event);
      return;
    }

    if (key === 'Delete') {
      event.preventDefault();
      handleDelete(event);
      return;
    }

    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End'
    ) {
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

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={5} width="target">
      <Popover.Target>
        <TextInput
          {...restProps}
          onChange={(event) => {
            const value = event.target.value;
            restProps.onChange?.(value === '' ? 0 : Number(value));
          }}
          value={displayValue ?? ''}
          rightSection={
            <ActionIcon onClick={() => setOpened((o) => !o)}>
              <IconCalculator size="1.1rem" />
            </ActionIcon>
          }
          onBeforeInput={onBeforeInput}
          onKeyDown={onKeyDown}
          onBlur={() => {
            restProps.onChange?.(Number(displayValue || 0));
            setOpened(false);
          }}
        />
      </Popover.Target>
      {opened && (
        <Popover.Dropdown p="xs">
          <Table verticalSpacing={2} horizontalSpacing={2} withRowBorders={false}>
            <Table.Tbody>
              <Table.Tr>
                {['7', '8', '9', '+'].map((value) => (
                  <Table.Td key={value}>
                    <Button
                      onClick={() => (value === '+' ? handleOperation('+') : handleNumber(value))}
                      p={0}
                      w="30px"
                      h="30px"
                    >
                      {value}
                    </Button>
                  </Table.Td>
                ))}
              </Table.Tr>
              <Table.Tr>
                {['4', '5', '6', '-'].map((value) => (
                  <Table.Td key={value}>
                    <Button
                      onClick={() => (value === '-' ? handleOperation('-') : handleNumber(value))}
                      p={0}
                      w="30px"
                      h="30px"
                    >
                      {value}
                    </Button>
                  </Table.Td>
                ))}
              </Table.Tr>
              <Table.Tr>
                {['1', '2', '3', '*'].map((value) => (
                  <Table.Td key={value}>
                    <Button
                      onClick={() => (value === '*' ? handleOperation('*') : handleNumber(value))}
                      p={0}
                      w="30px"
                      h="30px"
                    >
                      {value}
                    </Button>
                  </Table.Td>
                ))}
              </Table.Tr>
              <Table.Tr>
                {['0', '.', '=', '/'].map((value) => (
                  <Table.Td key={value}>
                    <Button
                      onClick={() => {
                        if (value === '=') {
                          handleEqual();
                        } else if (value === '/') {
                          handleOperation('/');
                        } else {
                          handleNumber(value);
                        }
                      }}
                      p={0}
                      w="30px"
                      h="30px"
                    >
                      {value}
                    </Button>
                  </Table.Td>
                ))}
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Popover.Dropdown>
      )}
    </Popover>
  );
}
