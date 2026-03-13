import React from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { Dataset } from '../../types/types';

export type GraphProps = {
  style?: React.CSSProperties;
  datasets: Dataset[];
  labels: string[];
  type: 'activity' | 'yearly';
  startDate?: string;
  endDate?: string;
  loaded: boolean;
  setGraphStartDate?: ActionCreatorWithPayload<
    string,
    'graph/setGraphStartDate' | 'graphView/setGraphViewStartDate'
  >;
  setGraphEndDate?: ActionCreatorWithPayload<
    string,
    'graph/setGraphEndDate' | 'graphView/setGraphViewEndDate'
  >;
};
