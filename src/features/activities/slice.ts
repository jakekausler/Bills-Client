import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Activity, BaseActivity, Bill, Interest } from "../../types/types";
import { toDateString } from "../../utils/date";

interface ActivitiesState {
  activities: Activity[];
  activitiesLoaded: boolean;
  activitiesError: string;

  selectedActivity: BaseActivity | null;
  selectedActivityBillId: string | null;
  selectedActivityInterestId: string | null;
  selectedActivityLoaded: boolean;

  selectedBill: Bill | null;
  selectedBillLoaded: boolean;

  interests: Interest[] | null;
  interestsLoaded: boolean;

  startDate: string;
  endDate: string;

  lastDate: string;

  // A dictionary of all activity and bill names mapped to their most common category
  names: Record<string, string>;
  namesLoaded: boolean;
}

const initialState: ActivitiesState = {
  activities: [],
  activitiesLoaded: false,
  activitiesError: "",
  selectedActivity: null,
  selectedActivityBillId: null,
  selectedActivityInterestId: null,
  selectedActivityLoaded: false,
  selectedBill: null,
  selectedBillLoaded: false,
  interests: null,
  interestsLoaded: false,
  startDate: toDateString(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  ),
  endDate: toDateString(
    new Date(new Date().setMonth(new Date().getMonth() + 3)),
  ),
  lastDate: toDateString(new Date()),
  names: {},
  namesLoaded: false,
};

export const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setActivities: (state, action: PayloadAction<Activity[]>) => {
      state.activities = action.payload;
      state.activitiesLoaded = true;
    },
    setActivitiesError: (state, action: PayloadAction<string>) => {
      state.activitiesError = action.payload;
    },
    setActivitiesLoaded: (state, action: PayloadAction<boolean>) => {
      state.activitiesLoaded = action.payload;
    },
    setSelectedActivity: (state, action: PayloadAction<Activity | null>) => {
      state.selectedActivity = action.payload;
      if (!action.payload) {
        state.selectedActivityBillId = null;
        state.selectedActivityInterestId = null;
      }
      state.selectedActivityLoaded = true;
    },
    setSelectedActivityBillId: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedActivityBillId = action.payload;
    },
    setSelectedActivityInterestId: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedActivityInterestId = action.payload;
    },
    setSelectedActivityLoaded: (state, action: PayloadAction<boolean>) => {
      state.selectedActivityLoaded = action.payload;
    },
    setSelectedBill: (state, action: PayloadAction<Bill | null>) => {
      state.selectedBill = action.payload;
      state.selectedBillLoaded = true;
    },
    setSelectedBillLoaded: (state, action: PayloadAction<boolean>) => {
      state.selectedBillLoaded = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    newActivity: (state) => {
      state.selectedActivity = {
        date: state.lastDate,
        date_is_variable: false,
        date_variable: null,
        name: "",
        category: "",
        amount: 0,
        flag: false,
        amount_is_variable: false,
        amount_variable: null,
        is_transfer: false,
        fro: null,
        to: null,
      };
      state.selectedActivityLoaded = true;
    },
    newBill: (state) => {
      state.selectedBill = {
        start_date: state.lastDate,
        start_date_is_variable: false,
        start_date_variable: null,
        end_date: null,
        end_date_is_variable: false,
        end_date_variable: null,
        every_n: 1,
        periods: "month",
        is_automatic: false,
        name: "",
        category: "",
        amount: 0,
        flag: false,
        amount_is_variable: false,
        amount_variable: null,
        is_transfer: false,
        fro: null,
        to: null,
      };
      state.selectedBillLoaded = true;
    },
    updateActivity: (state, action: PayloadAction<BaseActivity>) => {
      state.selectedActivity = action.payload;
      state.lastDate = action.payload.date;
      state.selectedActivityLoaded = true;
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      state.selectedBill = action.payload;
      state.lastDate = action.payload.start_date;
      state.selectedBillLoaded = true;
    },
    updateInterests: (state, action: PayloadAction<Interest[] | null>) => {
      state.interests = action.payload;
      state.interestsLoaded = true;
    },
    setInterestsLoaded: (state, action: PayloadAction<boolean>) => {
      state.interestsLoaded = action.payload;
    },
    updateNames: (state, action: PayloadAction<Record<string, string>>) => {
      state.names = action.payload;
      state.namesLoaded = true;
    },
    setNamesLoaded: (state, action: PayloadAction<boolean>) => {
      state.namesLoaded = action.payload;
    },
  },
});

export const {
  setActivities,
  setActivitiesError,
  setSelectedActivity,
  setSelectedActivityBillId,
  setSelectedActivityInterestId,
  setSelectedBill,
  setStartDate,
  setEndDate,
  newActivity,
  newBill,
  updateActivity,
  updateBill,
  updateInterests,
  updateNames,
  setSelectedActivityLoaded,
  setSelectedBillLoaded,
  setInterestsLoaded,
  setNamesLoaded,
  setActivitiesLoaded,
} = activitiesSlice.actions;
export default activitiesSlice.reducer;

