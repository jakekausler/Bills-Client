import React, { useEffect, useRef, useState } from 'react';
import { TextInput, ActionIcon, Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { toDateString } from '../../utils/date';

type DatePart = "month" | "day" | "year";

export const EditableDateInput = ({
  label,
  value,
  onBlur,
  placeholder,
  minDate,
  size,
  style,
  clearable,
}: {
  label?: string;
  value: string | null;
  onBlur: (value: string | null) => void;
  placeholder: string;
  minDate?: Date;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
  clearable?: boolean;
}) => {
  const [editedDate, setEditedDate] = useState(value);
  const [selectedPart, setSelectedPart] = useState<DatePart>("month");
  const [displayValue, setDisplayValue] = useState(() => {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (isNaN(date.getTime())) return "";
    return `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const validDate = (date: string | null) => {
    if (!date) return null;
    const dateObj = new Date(`${date}T00:00:00`);
    if (minDate && dateObj < minDate) {
      return "Date is before minimum date";
    }
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    return null;
  };

  const updateDisplayValue = (date: Date) => {
    setDisplayValue(`${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getFullYear()}`);
  };

  const getPartValues = () => {
    const [month, day, year] = displayValue.split('/');
    return {
      month: month || '',
      day: day || '',
      year: year || ''
    };
  };

  const updateDateFromParts = (parts: { month: string, day: string, year: string }) => {
    const newDisplayValue = `${parts.month.padStart(2, '0')}/${parts.day.padStart(2, '0')}/${parts.year}`;
    setDisplayValue(newDisplayValue);

    const date = new Date(parseInt(parts.year), parseInt(parts.month) - 1, parseInt(parts.day));
    if (!isNaN(date.getTime())) {
      setEditedDate(toDateString(date));
    }
  };

  const getCurrentDateFromValue = () => {
    if (!editedDate) {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
    return new Date(`${editedDate}T00:00:00`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const cursorPos = inputRef.current?.selectionStart || 0;

    // Determine selected part based on cursor position
    let currentPart: DatePart = "month";
    if (cursorPos >= 6) currentPart = "year";
    else if (cursorPos >= 3) currentPart = "day";

    setSelectedPart(currentPart);

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        const leftPart = currentPart === "month" ? "year" : currentPart === "day" ? "month" : "day";
        setSelectedPart(leftPart);
        setTimeout(() => {
          const start = leftPart === "month" ? 0 : leftPart === "day" ? 3 : 6;
          const end = leftPart === "month" ? 2 : leftPart === "day" ? 5 : 10;
          inputRef.current?.setSelectionRange(start, end);
        }, 0);
        break;
      case "ArrowRight":
        e.preventDefault();
        const rightPart = currentPart === "month" ? "day" : currentPart === "day" ? "year" : "month";
        setSelectedPart(rightPart);
        setTimeout(() => {
          const start = rightPart === "month" ? 0 : rightPart === "day" ? 3 : 6;
          const end = rightPart === "month" ? 2 : rightPart === "day" ? 5 : 10;
          inputRef.current?.setSelectionRange(start, end);
        }, 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        const upDate = getCurrentDateFromValue();
        if (currentPart === "month") {
          const newMonth = upDate.getMonth() + 1;
          upDate.setMonth(newMonth === 12 ? 0 : newMonth);
          if (newMonth === 12) upDate.setFullYear(upDate.getFullYear() + 1);
        } else if (currentPart === "day") {
          upDate.setDate(upDate.getDate() + 1);
        } else {
          upDate.setFullYear(upDate.getFullYear() + 1);
        }
        setEditedDate(toDateString(upDate));
        updateDisplayValue(upDate);
        setTimeout(() => {
          const start = currentPart === "month" ? 0 : currentPart === "day" ? 3 : 6;
          const end = currentPart === "month" ? 2 : currentPart === "day" ? 5 : 10;
          inputRef.current?.setSelectionRange(start, end);
        }, 0);
        break;
      case "ArrowDown":
        e.preventDefault();
        const downDate = getCurrentDateFromValue();
        if (currentPart === "month") {
          const newMonth = downDate.getMonth() - 1;
          downDate.setMonth(newMonth === -1 ? 11 : newMonth);
          if (newMonth === -1) downDate.setFullYear(downDate.getFullYear() - 1);
        } else if (currentPart === "day") {
          downDate.setDate(downDate.getDate() - 1);
        } else {
          downDate.setFullYear(downDate.getFullYear() - 1);
        }
        setEditedDate(toDateString(downDate));
        updateDisplayValue(downDate);
        setTimeout(() => {
          const start = currentPart === "month" ? 0 : currentPart === "day" ? 3 : 6;
          const end = currentPart === "month" ? 2 : currentPart === "day" ? 5 : 10;
          inputRef.current?.setSelectionRange(start, end);
        }, 0);
        break;
      case "Enter":
        e.preventDefault();
        if (validDate(editedDate) === null) {
          onBlur(editedDate);
        }
        break;
      case "Escape":
        e.preventDefault();
        setEditedDate(value);
        setDisplayValue(() => {
          if (!value) return "";
          const date = new Date(`${value}T00:00:00`);
          if (isNaN(date.getTime())) return "";
          return `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        });
        break;
      case "Tab":
        break;
      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);

    const [month, day, year] = newValue.split('/');
    if (month && day && year && year.length === 4) {
      const monthNum = parseInt(month);
      const dayNum = parseInt(day);
      const yearNum = parseInt(year);

      // Validate ranges
      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum > 1900) {
        const date = new Date(yearNum, monthNum - 1, dayNum);
        if (!isNaN(date.getTime()) && date.getMonth() === monthNum - 1) {
          setEditedDate(toDateString(date));
        }
      }
    }
  };

  const handleBlur = () => {
    setShowCalendar(false);
    if (validDate(editedDate) === null) {
      onBlur(editedDate);
    } else {
      setEditedDate(value);
      setDisplayValue(() => {
        if (!value) return "";
        const date = new Date(`${value}T00:00:00`);
        if (isNaN(date.getTime())) return "";
        return `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      });
    }
  };

  const handleClear = () => {
    setEditedDate(null);
    setDisplayValue("");
    onBlur(null);
  };

  const handleClick = () => {
    setTimeout(() => {
      const cursorPos = inputRef.current?.selectionStart || 0;
      let clickedPart: DatePart = "month";
      if (cursorPos >= 6) clickedPart = "year";
      else if (cursorPos >= 3) clickedPart = "day";

      setSelectedPart(clickedPart);

      const start = clickedPart === "month" ? 0 : clickedPart === "day" ? 3 : 6;
      const end = clickedPart === "month" ? 2 : clickedPart === "day" ? 5 : 10;
      inputRef.current?.setSelectionRange(start, end);
    }, 0);
  };

  const handleFocus = () => {
    setSelectedPart("month");
    setCalendarDate(getValidDateForCalendar());
    setShowCalendar(true);
    setTimeout(() => {
      inputRef.current?.setSelectionRange(0, 2);
    }, 0);
  };

  const handleCalendarChange = (date: Date | null) => {
    if (date) {
      const dateStr = toDateString(date);
      setEditedDate(dateStr);
      updateDisplayValue(date);
      onBlur(dateStr);
    }
    setShowCalendar(false);
    inputRef.current?.focus();
  };

  const getValidDateForCalendar = () => {
    if (!editedDate) {
      // If no date, try to parse from display value
      const [month, day, year] = displayValue.split('/');
      if (month && day && year && year.length === 4) {
        const monthNum = parseInt(month);
        const dayNum = parseInt(day);
        const yearNum = parseInt(year);

        if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum > 1900) {
          const date = new Date(yearNum, monthNum - 1, dayNum);
          if (!isNaN(date.getTime()) && date.getMonth() === monthNum - 1) {
            return date;
          }
        }
      }
      return new Date(); // Default to today if no valid date
    }

    const date = new Date(`${editedDate}T00:00:00`);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  useEffect(() => {
    setEditedDate(value);
    setDisplayValue(() => {
      if (!value) return "";
      const date = new Date(`${value}T00:00:00`);
      if (isNaN(date.getTime())) return "";
      return `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    });
  }, [value]);

  // Update calendar date when text input changes
  useEffect(() => {
    if (showCalendar) {
      setCalendarDate(getValidDateForCalendar());
    }
  }, [displayValue, editedDate, showCalendar]);

  return (
    <Popover
      opened={showCalendar}
      onClose={() => setShowCalendar(false)}
      position="bottom-start"
      withArrow
      shadow="md"
      offset={5}
    >
      <Popover.Target>
        <TextInput
          ref={inputRef}
          label={label}
          error={validDate(editedDate)}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onFocus={handleFocus}
          size={size}
          style={style}
          rightSection={
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {clearable && displayValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                >
                  ×
                </button>
              )}
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <IconCalendar size={16} />
              </ActionIcon>
            </div>
          }
        />
      </Popover.Target>
      <Popover.Dropdown data-calendar>
        <DatePicker
          value={getValidDateForCalendar()}
          date={calendarDate}
          onDateChange={setCalendarDate}
          onChange={handleCalendarChange}
          minDate={minDate}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
