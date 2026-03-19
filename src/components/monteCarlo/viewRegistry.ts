import { ComponentType } from 'react';
import { PercentileGraphData } from '../../types/types';

export interface MCViewProps {
  simulationId: string;
  reportingAccount: string | null;
  showReal: boolean;
  showDeterministic: boolean;
  graphData: PercentileGraphData | null;
}

export interface MCView {
  id: string;
  title: string;
  component: ComponentType<MCViewProps>;
  columns: 1 | 2 | 3;
}

export const mcViews: MCView[] = [];

export function registerView(view: MCView) {
  mcViews.push(view);
}
