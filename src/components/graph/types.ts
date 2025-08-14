import React from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { Dataset } from '../../types/types';

export type GraphProps = {
  style?: React.CSSProperties;
  datasets: Dataset[];
  labels: string[];
  type: 'activity' | 'yearly' | 'monteCarlo';
  startDate?: string;
  endDate?: string;
  loaded: boolean;
  hideLegend?: boolean;
  setGraphStartDate?: ActionCreatorWithPayload<
    string,
    'graph/setGraphStartDate' | 'graphView/setGraphViewStartDate' | 'monteCarlo/setMonteCarloStartDate'
  >;
  setGraphEndDate?: ActionCreatorWithPayload<
    string,
    'graph/setGraphEndDate' | 'graphView/setGraphViewEndDate' | 'monteCarlo/setMonteCarloEndDate'
  >;
};
