import React from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Dataset } from "../../types/types";

export type GraphProps = {
  style?: React.CSSProperties;
  datasets: Dataset[];
  labels: string[];
  type: "activity" | "yearly";
  endDate: string;
  loaded: boolean;
  setGraphEndDate: ActionCreatorWithPayload<string, "graph/setGraphEndDate" | "graphView/setGraphViewEndDate">;
};
