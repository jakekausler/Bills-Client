import React from 'react';
export type PageComponentType = React.ComponentType;
export type SidebarComponentType = React.ComponentType<{ close: () => void }>;

// Paycheck Profile and related types
export type ContributionConfig = {
  type: 'percent' | 'fixed';
  value: number;
  destinationAccount: string;
  frequency?: DeductionFrequency;
  increaseBy?: number;
  increaseByIsVariable?: boolean;
  increaseByVariable?: string | null;
};

export type EmployerMatchConfig = {
  mode: 'simple' | 'tiered' | 'fixed';
  simplePercent?: number;
  tiers?: { matchPercent: number; upToPercent: number }[];
  fixedAmount?: number;
  destinationAccount: string;
  increaseBy?: number;
  increaseByIsVariable?: boolean;
  increaseByVariable?: string | null;
};

export type PaycheckDeduction = {
  label: string;
  amount: number;
  type: 'preTax' | 'postTax';
  frequency?: DeductionFrequency;
  increaseBy?: number;
  increaseByIsVariable?: boolean;
  increaseByVariable?: string | null;
  reducesSSWages?: boolean;
  destinationAccount?: string;
  imputed?: boolean; // true = amount is added to gross and deducted back (nets to $0 cash, affects taxable wages)
};

export type BonusConfig = {
  percent: number;
  month: number;
  subjectTo401k?: boolean;
};

export type W4Config = {
  filingStatus: 'single' | 'mfj' | 'mfs' | 'hoh';
  extraWithholding?: number;
  multipleJobs?: boolean;
};

export type DeductionFrequency = 'perPaycheck' | 'monthly' | 'annual';

export type PaycheckProfile = {
  grossPay: number;
  traditional401k?: ContributionConfig;
  roth401k?: ContributionConfig;
  employerMatch?: EmployerMatchConfig;
  hsa?: ContributionConfig;
  hsaEmployerContribution?: number;  // annual amount, deposits to hsa.destinationAccount
  deductions?: PaycheckDeduction[];
  bonus?: BonusConfig;
  w4?: W4Config;
};

export type PaycheckDetails = {
  grossPay: number;
  traditional401k: number;
  roth401k: number;
  employerMatch: number;
  hsa: number;
  hsaEmployer: number;
  ssTax: number;
  medicareTax: number;
  preTaxDeductions: { label: string; amount: number }[];
  postTaxDeductions: { label: string; amount: number }[];
  netPay: number;
  parentPaycheckId?: string;
};

export type NameEntry = {
  name: string;
  category: string;
  isHealthcare: boolean;
  healthcarePerson: string | null;
  coinsurancePercent: number | null;
  isTransfer: boolean;
  from: string | null;
  to: string | null;
  spendingCategory: string | null;
};

// Alias for backwards compatibility
export type NameMetadata = Omit<NameEntry, 'name'>;

export type BaseActivity = {
  id?: string;
  date: string;
  dateIsVariable: boolean;
  dateVariable: string | null;
  name: string;
  category: string;
  amount: number | string;
  flag: boolean;
  flagColor: string | null;
  amountIsVariable: boolean;
  amountVariable: string | null;
  isTransfer: boolean;
  from: string | null;
  to: string | null;

  // Healthcare fields
  isHealthcare?: boolean;
  healthcarePerson?: string | null;
  copayAmount?: number | null;
  coinsurancePercent?: number | null;
  countsTowardDeductible?: boolean;
  countsTowardOutOfPocket?: boolean;

  // Spending tracker fields
  spendingCategory?: string | null;

  // Paycheck fields
  paycheckDetails?: PaycheckDetails | null;
  isPaycheckActivity?: boolean;
};

export type Activity = BaseActivity & {
  billId: string | null;
  firstBill: boolean;
  interestId: string | null;
  firstInterest: boolean;
  spendingTrackerId: string | null;
  firstSpendingTracker: boolean;
  balance: number;
  cashBalance: number;
  investmentValue: number;
  investmentActivityType: 'buy' | 'sell' | 'dividend' | 'fee';
  investmentActions: {
    symbol: string;
    shares: number;
    pricePerShare: number;
    totalPrice: number;
  }[];
};

export type CategoryActivity = Activity & {
  account: string;
};

export type Bill = {
  id?: string;
  name: string;
  category: string;
  amount: number | string; // number for fixed values, string for variable expressions (e.g., "VARIABLE_NAME")
  flag: boolean;
  flagColor: string | null;
  amountIsVariable: boolean;
  amountVariable: string | null;
  isTransfer: boolean;
  from: string | null;
  to: string | null;
  startDate: string;
  startDateIsVariable: boolean;
  startDateVariable: string | null;
  endDate: string | null;
  endDateIsVariable: boolean;
  endDateVariable: string | null;
  everyN: number;
  periods: string;
  isAutomatic: boolean;
  annualStartDate: string | null;
  annualEndDate: string | null;
  annualStartDateIsVariable: boolean;
  annualEndDateIsVariable: boolean;
  annualStartDateVariable: string | null;
  annualEndDateVariable: string | null;
  increaseBy: number;
  increaseByIsVariable: boolean;
  increaseByVariable: string | null;
  increaseByDate: string;

  // Healthcare fields
  isHealthcare?: boolean;
  healthcarePerson?: string | null;
  copayAmount?: number | null;
  coinsurancePercent?: number | null;
  countsTowardDeductible?: boolean;
  countsTowardOutOfPocket?: boolean;

  // Spending tracker fields
  spendingCategory?: string | null;

  // Paycheck fields
  paycheckProfile?: PaycheckProfile | null;
  taxDeductible?: boolean | null;
  studentLoanInterest?: boolean | null;
};

export type Interest = {
  id: string;
  apr: number | string; // number for fixed values, string for variable expressions (e.g., "VARIABLE_NAME")
  aprIsVariable: boolean;
  aprVariable: string | null;
  compounded: 'day' | 'week' | 'month' | 'year';
  applicableDate: string;
  applicableDateIsVariable: boolean;
  applicableDateVariable: string | null;
};

export type Account = {
  id: string;
  name: string;
  balance: number;
  hidden: boolean;
  type: string;
  pullPriority: number;
  interestTaxRate: number;
  withdrawalTaxRate: number;
  expenseRatio: number;
  earlyWithdrawalPenalty: number;
  earlyWithdrawalDate: string | null;
  interestPayAccount: string | null;
  interestAppliesToPositiveBalance: boolean;
  usesRMD: boolean;
  accountOwnerDOB: string | null;
  rmdAccount: string | null;
  minimumBalance: number | null;
  maximumBalance: number | null;
  minimumPullAmount: number | null;
  performsPulls: boolean;
  performsPushes: boolean;
  pushStart: string | null;
  pushEnd: string | null;
  pushAccount: string | null;
};

export type GraphData = {
  [simulation: string]: {
    datasets: Dataset[];
    labels: string[];
    type: 'activity' | 'yearly';
  };
};

export type Dataset = {
  label: string;
  data: number[];
  borderColor: string;
  borderDash: number[];
  backgroundColor: string;
  activity: GraphActivity | GraphActivity[];
};

export type PercentileDataset = {
  label: string;
  data: number[];
  percentile?: number;
  isDeterministic?: boolean;
  accountId?: string;
  accountName?: string;
  realValues?: number[];
  borderColor?: string;
  backgroundColor?: string;
};

export type PercentileGraphData = {
  type: 'percentile';
  labels: string[];
  datasets: PercentileDataset[];
  fundedRatio?: number;
  failedSimulations?: number;
  totalSimulations?: number;
  medianFailureYear?: number | null;
  worstYear?: { year: number; medianMinBalance: number; realMedianMinBalance: number };
  finalYear?: {
    median: number;
    p5: number;
    p25: number;
    p75: number;
    p95: number;
    realMedian: number;
    realP5: number;
    realP25: number;
    realP75: number;
    realP95: number;
  };
  seed?: number;
  accountNames?: Array<{ id: string; name: string }>;
};

export type GraphActivity = {
  amount: number;
  name: string;
};

export type Simulation = {
  name: string;
  variables: Record<string, { type: string; value: number | string }>;
  enabled: boolean;
  selected: boolean;
};

export type HealthcareConfig = {
  id: string;
  name: string;
  coveredPersons: string[];  // e.g., ["Jake", "Jane"]
  startDate: string;
  endDate: string | null;
  individualDeductible: number;
  individualOutOfPocketMax: number;
  familyDeductible: number;
  familyOutOfPocketMax: number;
  hsaAccountId: string | null;
  hsaReimbursementEnabled: boolean;
  resetMonth: number;
  resetDay: number;
};

export type SpendingTrackerCategory = {
  id: string;
  name: string;
  threshold: number;
  thresholdIsVariable: boolean;
  thresholdVariable: string | null;
  interval: 'weekly' | 'monthly' | 'yearly';
  intervalStart: string;
  accountId: string;
  carryOver: boolean;
  carryUnder: boolean;
  increaseBy: number;
  increaseByIsVariable: boolean;
  increaseByVariable: string | null;
  increaseByDate: string;
  initializeDate: string | null;
  thresholdChanges: {
    date: string;
    dateIsVariable: boolean;
    dateVariable: string | null;
    newThreshold: number;
    newThresholdIsVariable: boolean;
    newThresholdVariable: string | null;
    resetCarry: boolean;
  }[];
};

export type DeductibleProgress = {
  configId: string;
  configName: string;
  planYear: number;
  coveredPersons: string[];

  // Family-level aggregates
  familyDeductibleSpent: number;
  familyDeductibleRemaining: number;
  familyDeductibleMet: boolean;
  familyOOPSpent: number;
  familyOOPRemaining: number;
  familyOOPMet: boolean;

  // Per-person breakdown
  individualProgress: {
    personName: string;
    deductibleSpent: number;
    deductibleMet: boolean;
    oopSpent: number;
    oopMet: boolean;
  }[];

  // Thresholds for display
  individualDeductibleLimit: number;
  familyDeductibleLimit: number;
  individualOOPLimit: number;
  familyOOPLimit: number;
};

export type ProgressHistoryDataPoint = {
  date: string;
  personName: string | null; // null = family level, "Jake"/"Kendall" = individual
  deductibleSpent: number;
  oopSpent: number;
};

export type HealthcareExpense = {
  id: string;
  date: string;
  name: string;
  person: string;
  billAmount: number;
  patientCost: number;
  copay: number | null;
  coinsurance: number | null;
  hsaReimbursed: number;
  accountName: string;
  isBill: boolean;
  billId?: string | null;
  individualDeductibleRemaining: number;
  familyDeductibleRemaining: number;
  individualOOPRemaining: number;
  familyOOPRemaining: number;
};

export type UsedVariableMap = Record<string, UsedVariable[]>;

export type UsedVariable = {
  name: string;
  type: string;
  date?: string;
  account?: string;
  from?: string;
  to?: string;
};

// TODO: Change value to be a breakdown object
export type CategoryBreakdown = Record<string, number>;

export type Breakdown = {
  activity: Activity[];
  amount: number;
};

export type CalendarBill = Bill & {
  date: string;
  amount: number;
  account: string;
};

export type Flow = {
  nodes: FlowNode[];
  links: FlowLink[];
};

export type FlowNode = {
  name: string;
  x0: number;
  y0: number;
  y1: number;
  value: number;
};

export type FlowLink = {
  source: number;
  target: number;
  value: number;
  y0: number;
  y1: number;
};

export type MoneyMovementData = {
  labels: string[];
  datasets: Dataset[];
};

export type ChartDataPoint = {
  periodStart: string;
  periodEnd: string;
  totalSpent: number;
  baseThreshold: number;
  effectiveThreshold: number;
  remainder: number;
  carryAfter: number;
  isCurrent: boolean;
};

export type ChartDataResponse = {
  periods: ChartDataPoint[];
  nextPeriodThreshold: number;
  cumulativeSpent: number;
  cumulativeThreshold: number;
};

export interface FailureHistogramData {
  histogram: Array<{ year: string; count: number }>;
  summary: {
    totalSimulations: number;
    failedSimulations: number;
    medianFailureYear: number | null;
    earliestFailureYear: number | null;
    latestFailureYear: number | null;
  };
}

export interface FanData {
  p0: number[];
  p5: number[];
  p25: number[];
  p40: number[];
  p50: number[];
  p60: number[];
  p75: number[];
  p95: number[];
  p100: number[];
}

export interface IncomeExpenseData {
  labels: string[];
  breakdown: {
    income: Record<string, number[]>;
    expenses: Record<string, number[]>;
  };
  /** Keyed by income category (plus "Total"), each value is FanData */
  incomeFan: Record<string, FanData>;
  /** Keyed by expense category (plus "Total"), each value is FanData */
  expenseFan: Record<string, FanData>;
  summary: {
    medianNetCashFlow: number[];
    p5NetCashFlow: number[];
    p95NetCashFlow: number[];
    cumulativeNetCashFlow: { median: number; p5: number; p95: number };
  };
  realBreakdown: {
    income: Record<string, number[]>;
    expenses: Record<string, number[]>;
  };
  realIncomeFan: Record<string, FanData>;
  realExpenseFan: Record<string, FanData>;
  realSummary: {
    medianNetCashFlow: number[];
    p5NetCashFlow: number[];
    p95NetCashFlow: number[];
    cumulativeNetCashFlow: { median: number; p5: number; p95: number };
  };
}

export interface WorstCasesData {
  labels: string[];
  simulations: Array<{
    simulationNumber: number;
    finalBalance: number;
    data: number[];
    realData: number[];
    failureYear: number | null;
  }>;
  deterministic?: {
    data: number[];
    realData: number[];
  };
}
