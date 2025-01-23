import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dataset } from "../../types/types";
import { GraphData } from "../../types/types";
import { toDateString } from "../../utils/date";

interface GraphState {
  datasets: Dataset[];
  labels: string[];
  type: "activity" | "yearly";
  loaded: boolean;
  error: string;

  endDate: string;

  show: boolean;
}

const initialState: GraphState = {
  datasets: [],
  labels: [],
  type: "activity",
  loaded: false,
  error: "",

  endDate: toDateString(
    new Date(new Date().setMonth(new Date().getMonth() + 24)),
  ),

  show: true,
};

const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setGraphData: (state, action: PayloadAction<GraphData>) => {
      state.datasets = action.payload.datasets;
      state.labels = action.payload.labels;
      state.type = action.payload.type;
      state.loaded = true;
    },
    setGraphError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setGraphEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setShowGraph: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    toggleGraph: (state) => {
      state.show = !state.show;
    },
    updateGraphLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
  },
});

export const {
  setGraphData,
  setGraphError,
  setGraphEndDate,
  setShowGraph,
  toggleGraph,
  updateGraphLoaded,
} = graphSlice.actions;
export default graphSlice.reducer;
