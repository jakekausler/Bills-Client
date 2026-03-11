export const toDate = (dateStr: string) => {
  return new Date(dateStr);
};

export const toDateString = (date: Date) => {
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
};

export const formatDateISO = (date: Date) => {
  return toDateString(date);
};
