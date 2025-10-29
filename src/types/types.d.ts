import React from 'react';
export type PageComponentType = React.ComponentType<any>;
export type SidebarComponentType = React.ComponentType<any>;

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
};

export type Activity = BaseActivity & {
  billId: string | null;
  firstBill: boolean;
  interestId: string | null;
  firstInterest: boolean;
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
  amount: number | string;
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
};

export type Interest = {
  id: string;
  apr: number | string;
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
  earlyWithdrawlPenalty: number;
  earlyWithdrawlDate: string | null;
  interestPayAccount: string | null;
  usesRMD: boolean;
  accountOwnerDOB: string | null;
  rmdAccount: string | null;
  minimumBalance: number | null;
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
  activity: GraphActivity;
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
  personName: string;
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

export type DeductibleProgress = {
  configId: string;
  configName: string;
  planYear: number;
  individualDeductibleSpent: number;
  individualDeductibleRemaining: number;
  individualDeductibleMet: boolean;
  familyDeductibleSpent: number;
  familyDeductibleRemaining: number;
  familyDeductibleMet: boolean;
  individualOOPSpent: number;
  individualOOPRemaining: number;
  individualOOPMet: boolean;
  familyOOPSpent: number;
  familyOOPRemaining: number;
  familyOOPMet: boolean;
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
