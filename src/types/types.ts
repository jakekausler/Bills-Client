import React from "react";
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
  amountIsVariable: boolean;
  amountVariable: string | null;
  isTransfer: boolean;
  from: string | null;
  to: string | null;
};

export type Activity = BaseActivity & {
  billId: string | null;
  firstBill: boolean;
  interestId: string | null;
  firstInterest: boolean;
  balance: number;
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
  increaseByPeriods: string;
};

export type Interest = {
  id: string;
  apr: number | string;
  aprIsVariable: boolean;
  aprVariable: string | null;
  compounded: "day" | "week" | "month" | "year";
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
};

export type GraphData = {
  datasets: Dataset[];
  labels: string[];
  type: "activity" | "yearly";
};

export type Dataset = {
  label: string;
  data: number[];
  activity: GraphActivity;
};

export type GraphActivity = {
  amount: number;
  name: string;
};

export type Simulation = {
  name: string;
  variables: Record<string, { type: string; value: number | string | boolean }>;
  enabled: boolean;
  selected: boolean;
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
