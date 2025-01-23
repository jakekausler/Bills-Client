
export type PageComponentType = React.ComponentType<any>;
export type SidebarComponentType = React.ComponentType<any>;

export type BaseActivity = {
  id?: string;
  date: string;
  date_is_variable: boolean;
  date_variable: string | null;
  name: string;
  category: string;
  amount: number | string;
  flag: boolean;
  amount_is_variable: boolean;
  amount_variable: string | null;
  is_transfer: boolean;
  fro: string | null;
  to: string | null;
};

export type Activity = BaseActivity & {
  bill_id: string | null;
  first_bill: boolean;
  interest_id: string | null;
  first_interest: boolean;
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
  amount_is_variable: boolean;
  amount_variable: string | null;
  is_transfer: boolean;
  fro: string | null;
  to: string | null;
  start_date: string;
  start_date_is_variable: boolean;
  start_date_variable: string | null;
  end_date: string | null;
  end_date_is_variable: boolean;
  end_date_variable: string | null;
  every_n: number;
  periods: string;
  is_automatic: boolean;
  annual_start_date: string | null;
  annual_end_date: string | null;
};

export type Interest = {
  id: string;
  apr: number | string;
  apr_is_variable: boolean;
  apr_variable: string | null;
  compounded: "day" | "week" | "month" | "year";
  applicable_date: string;
  applicable_date_is_variable: boolean;
  applicable_date_variable: string | null;
};

export type Account = {
  id: string;
  name: string;
  balance: number;
  hidden: boolean;
  type: string;
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
