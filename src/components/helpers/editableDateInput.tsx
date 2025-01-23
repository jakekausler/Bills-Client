// import { TextInput } from "@mantine/core";
// import { DateInput } from "@mantine/dates";
// import { useEffect, useRef, useState } from "react";
// import { toDateString } from "../../utils/date";

import { DateInput } from "@mantine/dates";
import { toDateString } from "../../utils/date";
import { useState } from "react";

// type DatePart = "month" | "day" | "year";

// export const EditableDateInput = ({
//   label,
//   value,
//   onBlur,
//   placeholder,
//   minDate,
// }: {
//   label: string;
//   value: string | null;
//   onBlur: (value: string | null) => void;
//   placeholder: string;
//   minDate?: Date;
// }) => {
//   const validDate = (date: string | null) => {
//     if (!date) return null;
//     const dateObj = new Date(`${date}T00:00:00`);
//     if (minDate && dateObj < minDate) {
//       return "Date is before minimum date";
//     }
//     if (isNaN(dateObj.getTime())) {
//       return "Invalid date";
//     }
//     return null;
//   };

//   const [editedDate, setEditedDate] = useState(value);
//   const [selectedPart, setSelectedPart] = useState<DatePart>("month");
//   const [displayValue, setDisplayValue] = useState(() => {
//     if (!value) return "";
//     const date = new Date(`${value}T00:00:00`);
//     if (isNaN(date.getTime())) return "";
//     return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
//   });
//   const inputRef = useRef<HTMLInputElement>(null);

//   const updateDisplayValue = (date: Date) => {
//     setDisplayValue(`${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`);
//   };

//   const getPartValues = () => {
//     const [month, day, year] = displayValue.split('/');
//     return {
//       month: month || '',
//       day: day || '',
//       year: year || ''
//     };
//   };

//   const updateDateFromParts = (parts: { month: string, day: string, year: string }) => {
//     const newDisplayValue = `${parts.month.padStart(2, '0')}/${parts.day.padStart(2, '0')}/${parts.year}`;
//     setDisplayValue(newDisplayValue);

//     const date = new Date(parseInt(parts.year), parseInt(parts.month) - 1, parseInt(parts.day));
//     if (!isNaN(date.getTime())) {
//       setEditedDate(toDateString(date));
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     const date = new Date(`${editedDate}T00:00:00`);
//     if (isNaN(date.getTime())) return;

//     const parts = getPartValues();
//     const cursorPos = inputRef.current?.selectionStart || 0;

//     switch (e.key) {
//       case "ArrowLeft":
//         e.preventDefault();
//         setSelectedPart(selectedPart === "month" ? "year" : selectedPart === "day" ? "month" : "day");
//         break;
//       case "ArrowRight":
//         e.preventDefault();
//         setSelectedPart(selectedPart === "month" ? "day" : selectedPart === "day" ? "year" : "month");
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         if (selectedPart === "month") {
//           const newMonth = date.getMonth() + 1;
//           date.setMonth(newMonth === 12 ? 0 : newMonth);
//         } else if (selectedPart === "day") {
//           date.setDate(date.getDate() + 1);
//           if (date.getDate() === 1) {
//             date.setMonth(date.getMonth() + 1);
//           }
//         } else {
//           date.setFullYear(date.getFullYear() + 1);
//         }
//         setEditedDate(toDateString(date));
//         updateDisplayValue(date);
//         break;
//       case "ArrowDown":
//         e.preventDefault();
//         if (selectedPart === "month") {
//           const newMonth = date.getMonth() - 1;
//           date.setMonth(newMonth === -1 ? 11 : newMonth);
//         } else if (selectedPart === "day") {
//           const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//           date.setDate(date.getDate() - 1);
//           if (date.getDate() === lastDay) {
//             date.setMonth(date.getMonth() - 1);
//           }
//         } else {
//           date.setFullYear(date.getFullYear() - 1);
//         }
//         setEditedDate(toDateString(date));
//         updateDisplayValue(date);
//         break;
//       case "Enter":
//         e.preventDefault();
//         onBlur(editedDate);
//         break;
//       case "Escape":
//         e.preventDefault();
//         setDisplayValue(value || "");
//         break;
//       case "Backspace":
//         e.preventDefault();
//         if (selectedPart === "month") {
//           parts.month = parts.month.slice(0, -1);
//           if (parts.month === '') parts.month = '1';
//         } else if (selectedPart === "day") {
//           parts.day = parts.day.slice(0, -1);
//           if (parts.day === '') parts.day = '1';
//         } else {
//           parts.year = parts.year.slice(0, -1);
//           if (parts.year.length < 4) parts.year = parts.year.padStart(4, '2');
//         }
//         updateDateFromParts(parts);
//         break;
//       case "Delete":
//         e.preventDefault();
//         if (selectedPart === "month") {
//           parts.month = parts.month.slice(1);
//           if (parts.month === '') parts.month = '1';
//         } else if (selectedPart === "day") {
//           parts.day = parts.day.slice(1);
//           if (parts.day === '') parts.day = '1';
//         } else {
//           parts.year = parts.year.slice(1);
//           if (parts.year.length < 4) parts.year = parts.year.padStart(4, '2');
//         }
//         updateDateFromParts(parts);
//         break;
//       case "Tab":
//         break;
//       default:
//         if (/^\d$/.test(e.key)) {
//           e.preventDefault();
//           if (selectedPart === "month") {
//             const newMonth = parts.month.length === 2 ? e.key : parts.month + e.key;
//             parts.month = Math.min(parseInt(newMonth), 12).toString();
//           } else if (selectedPart === "day") {
//             const maxDays = new Date(parseInt(parts.year), parseInt(parts.month), 0).getDate();
//             const newDay = parts.day.length === 2 ? e.key : parts.day + e.key;
//             parts.day = Math.min(parseInt(newDay), maxDays).toString();
//           } else {
//             if (parts.year.length === 4) {
//               parts.year = e.key;
//             } else {
//               parts.year += e.key;
//             }
//             parts.year = parts.year.padStart(4, '2');
//           }
//           updateDateFromParts(parts);
//         }
//         break;
//     }
//   };

//   useEffect(() => {
//     if (inputRef.current) {
//       const input = inputRef.current;
//       const start = selectedPart === "month" ? 0 : selectedPart === "day" ? 3 : 6;
//       const end = selectedPart === "month" ? 2 : selectedPart === "day" ? 5 : 10;
//       input.setSelectionRange(start, end);
//     }
//   }, [selectedPart, displayValue]);

//   return (
//     <TextInput
//       ref={inputRef}
//       label={label}
//       error={validDate(editedDate)}
//       value={displayValue}
//       onChange={(e) => {
//         setDisplayValue(e.target.value);
//         const [month, day, year] = e.target.value.split('/');
//         const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
//         if (!isNaN(date.getTime())) {
//           setEditedDate(toDateString(date));
//         }
//       }}
//       placeholder={placeholder}
//       onBlur={() => {
//         if (validDate(editedDate) === null) {
//           onBlur(editedDate);
//         }
//       }}
//       onKeyDown={handleKeyDown}
//       rightSection={
//         <DateInput
//           value={new Date(`${editedDate}T00:00:00`).getTime() ? new Date(`${editedDate}T00:00:00`) : null}
//           onChange={(date) => {
//             if (date) {
//               setEditedDate(toDateString(date));
//               updateDisplayValue(date);
//             }
//           }}
//           valueFormat="MM/DD/YYYY"
//           style={{ display: 'none' }}
//         />
//       }
//     />
//   );
// };

export const EditableDateInput = ({
  label,
  value,
  onBlur,
  placeholder,
  minDate,
  size,
}: {
  label?: string;
  value: string | null;
  onBlur: (value: string | null) => void;
  placeholder: string;
  minDate?: Date;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) => {
  const [editedDate, setEditedDate] = useState(value);

  const getValidDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(`${dateStr}T00:00:00`);
    return isNaN(date.getTime()) ? null : date;
  };

  return (
    <DateInput
      label={label}
      value={getValidDate(editedDate)}
      onBlur={(e) => {
        if (e.target.value) {
          onBlur(toDateString(new Date(e.target.value)));
        }
      }}
      onChange={(date) => {
        if (date) {
          setEditedDate(toDateString(date));
        } else {
          setEditedDate(null);
        }
      }}
      valueFormat="MM/DD/YYYY"
      placeholder={placeholder}
      minDate={minDate}
      size={size}
    />
  )
}
