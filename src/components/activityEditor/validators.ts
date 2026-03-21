import { MantineTheme } from '@mantine/core';

interface GroupedOptions {
  group: string;
  items: { value: string; label: string }[];
}

export type ValidatorContext = {
  categories?: { group: string; items: { value: string; label: string }[] }[];
  accounts?: { id: string; name: string }[];
  accountList?: GroupedOptions[];
  amountVariables?: string[];
  dateVariables?: string[];
  theme?: MantineTheme;
  // Entity-specific context
  isTransfer?: boolean;
  isHealthcare?: boolean;
  healthcarePerson?: string | null;
  amountIsVariable?: boolean;
  dateIsVariable?: boolean;
  // Bill-specific
  startDateIsVariable?: boolean;
  endDateIsVariable?: boolean;
  increaseByIsVariable?: boolean;
  // Interest-specific
  aprIsVariable?: boolean;
  applicableDateIsVariable?: boolean;
};

export type Validator = (value: unknown, ctx: ValidatorContext) => string | null;

// Shared validators (identical between activity & bill)
export const validateName: Validator = (value) => {
  if (!value || (value as string).trim() === '') {
    return 'Invalid name';
  }
  return null;
};

export const validateCategory: Validator = (value, ctx) => {
  if (!ctx.categories) {
    return null;
  }
  if (!ctx.categories.find((c) => !!c.items.find((i) => i.value === value))) {
    return 'Invalid category';
  }
  return null;
};

export const validateIsTransfer: Validator = (value) => {
  if (typeof value !== 'boolean') {
    return 'Invalid isTransfer';
  }
  return null;
};

export const validateFrom: Validator = (value, ctx) => {
  // Skip validation if not a transfer
  if (ctx.isTransfer === false) {
    return null;
  }
  if (!ctx.accountList) {
    return null;
  }
  if (!ctx.accountList.find((a) => a.items.find((i) => i.value === value))) {
    return 'Invalid account';
  }
  return null;
};

export const validateTo: Validator = (value, ctx) => {
  // Skip validation if not a transfer
  if (ctx.isTransfer === false) {
    return null;
  }
  if (!ctx.accountList) {
    return null;
  }
  if (!ctx.accountList.find((a) => a.items.find((i) => i.value === value))) {
    return 'Invalid account';
  }
  return null;
};

export const validateFlag: Validator = (value) => {
  if (typeof value !== 'boolean') {
    return 'Invalid flag';
  }
  return null;
};

export const validateFlagColor: Validator = (value, ctx) => {
  if (value !== null && value !== undefined && ctx.theme && !ctx.theme.colors[value as string]) {
    return 'Invalid flagColor';
  }
  return null;
};

export const validateIsHealthcare: Validator = (value, ctx) => {
  // When healthcare is checked, validate that person name is not empty
  if (value === true && (!ctx.healthcarePerson || (ctx.healthcarePerson as string).trim() === '')) {
    return 'Person name is required for healthcare expenses';
  }
  return null;
};

export const validateHealthcarePerson: Validator = (value, ctx) => {
  if (ctx.isHealthcare && (!value || (value as string).trim() === '')) {
    return 'Person name is required for healthcare expenses';
  }
  return null;
};

export const validateCoinsurancePercent: Validator = (value) => {
  if (value !== null && value !== undefined && value !== '') {
    const numValue = Number(value);
    if (!isNaN(numValue) && (numValue < 0 || numValue > 100)) {
      return 'Coinsurance must be between 0% and 100%';
    }
  }
  return null;
};

// Date validators
export const validateDate: Validator = (value) => {
  const date = new Date(value as string);
  if (date.toString() === 'Invalid Date') {
    return 'Invalid date';
  }
  return null;
};

export const validateDateVariable: Validator = (value, ctx) => {
  // Skip validation if not in variable mode
  if (!ctx.dateIsVariable && !ctx.startDateIsVariable && !ctx.endDateIsVariable) {
    return null;
  }
  if (!ctx.dateVariables || !ctx.dateVariables.includes(value as string)) {
    return 'Invalid date';
  }
  return null;
};

export const validateMMDD: Validator = (value) => {
  // Empty values are valid (optional fields)
  if (value === '' || value === undefined || value === null) {
    return null;
  }

  const dateParts = (value as string).split('/');
  if (dateParts.length !== 2) {
    return 'Invalid date format - use MM/DD';
  }

  const month = parseInt(dateParts[0]);
  const day = parseInt(dateParts[1]);

  if (isNaN(month) || month < 1 || month > 12) {
    return 'Invalid month';
  }

  if (month < 10 && dateParts[0].length === 1) {
    return 'Please use 01, 02, 03, etc.';
  }

  if (day < 10 && dateParts[1].length === 1) {
    return 'Please use 01, 02, 03, etc.';
  }

  const daysInMonth = new Date(2024, month, 0).getDate();
  if (isNaN(day) || day < 1 || day > daysInMonth) {
    return 'Invalid day for month';
  }

  return null;
};

// Amount validators
export const validateNumber: Validator = (value) => {
  if (isNaN(value as number) || typeof value === 'boolean') {
    return 'Invalid amount';
  }
  return null;
};

export const validateAmountVariable: Validator = (value, ctx) => {
  // Skip validation if not in variable mode
  if (!ctx.amountIsVariable) {
    return null;
  }
  if (!ctx.amountVariables) {
    return null;
  }
  if (!ctx.amountVariables.includes(value as string) && value !== '{HALF}' && value !== '{FULL}') {
    return 'Invalid amount';
  }
  return null;
};

export const validateBillAmount: Validator = (value, ctx) => {
  // Check for valid format (number, variable, or special keywords)
  if (
    (isNaN(value as number) || typeof value === 'boolean') &&
    value !== '{HALF}' &&
    value !== '{FULL}' &&
    value !== '-{HALF}' &&
    value !== '-{FULL}'
  ) {
    return 'Invalid amount';
  }

  // Healthcare bills must have a non-zero amount (only when not variable)
  if (ctx.isHealthcare && !ctx.amountIsVariable) {
    const numValue = Number(value);
    if (numValue === 0) {
      return 'Healthcare bills require a non-zero amount. Enter the total bill from your provider.';
    }
  }

  return null;
};

export const validateBillAmountVariable: Validator = (value, ctx) => {
  // Skip validation if not in variable mode
  if (!ctx.amountIsVariable) {
    return null;
  }
  if (!ctx.amountVariables) {
    return null;
  }
  if (
    !ctx.amountVariables.includes(value as string) &&
    value !== '{HALF}' &&
    value !== '{FULL}' &&
    value !== '-{HALF}' &&
    value !== '-{FULL}'
  ) {
    return 'Invalid amount';
  }
  return null;
};

export const validatePeriods: Validator = (value) => {
  if (!['day', 'week', 'month', 'year'].includes(value as string)) {
    return 'Invalid periods';
  }
  return null;
};

// Bill-specific validators
export const validateEveryN: Validator = (value) => {
  if (isNaN(value as number) || typeof value === 'boolean') {
    return 'Invalid everyN';
  }
  return null;
};

export const validateIncreaseBy: Validator = (value) => {
  if (isNaN(value as number) || typeof value === 'boolean') {
    return 'Invalid increaseBy';
  }
  return null;
};

export const validateIncreaseByVariable: Validator = (value, ctx) => {
  // Skip validation if not in variable mode
  if (!ctx.increaseByIsVariable) {
    return null;
  }
  if (!ctx.amountVariables) {
    return null;
  }
  if (!ctx.amountVariables.includes(value as string)) {
    return 'Invalid increaseBy';
  }
  return null;
};

// Interest-specific validators
export const validateAPR: Validator = (value) => {
  if (isNaN(value as number) || typeof value === 'boolean') {
    return 'Invalid apr';
  }
  return null;
};

export const validateAPRVariable: Validator = (value, ctx) => {
  // Only validate if using a variable
  if (ctx.aprIsVariable && ctx.amountVariables && !ctx.amountVariables.includes(value as string)) {
    return 'Invalid variable';
  }
  return null;
};

export const validateApplicableDateVariable: Validator = (value, ctx) => {
  // Only validate if using a variable (dateVariables not currently implemented)
  if (ctx.applicableDateIsVariable && value !== null) {
    return 'Invalid variable';
  }
  return null;
};

export const validateCompounded: Validator = (value) => {
  if (!['day', 'week', 'month', 'year'].includes(value as string)) {
    return 'Invalid compounded';
  }
  return null;
};

// Paycheck validators
export const validateGrossPay: Validator = (value, ctx) => {
  if (value === null || value === undefined) {
    return null;
  }
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'Invalid gross pay';
  }
  if (numValue <= 0) {
    return 'Gross pay must be greater than 0';
  }
  return null;
};

export const validateContributionValue: Validator = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'Invalid value';
  }
  if (numValue < 0) {
    return 'Value must be greater than or equal to 0';
  }
  return null;
};

export const validateDestinationAccount: Validator = (value, ctx) => {
  if (!value) {
    return 'Destination account is required';
  }
  if (!ctx.accountList) {
    return null;
  }
  if (!ctx.accountList.find((a) => a.items.find((i) => i.value === value))) {
    return 'Invalid account';
  }
  return null;
};

// Helper to run a validator map
export function runValidate(
  validators: Record<string, Validator>,
  name: string,
  value: unknown,
  ctx: ValidatorContext
): string | null {
  const validator = validators[name];
  return validator ? validator(value, ctx) : null;
}
