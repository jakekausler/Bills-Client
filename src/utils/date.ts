export const toDate = (dateStr: string) => {
  return new Date(dateStr);
};

export const toDateString = (date: Date) => {
  return `${date.getFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
};
