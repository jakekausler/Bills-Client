import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const initialState = {
    categories: {},
    categoriesLoaded: false,
    categoriesError: '',
    categoryBreakdown: {},
    categoryBreakdownLoaded: false,
    selectedCategory: '',
    selectedCategoryBreakdown: {},
    selectedCategoryBreakdownLoaded: false,
    selectedCategoryActivity: [],
    selectedCategoryActivityLoaded: false,
    breakdownStart: dayjs.utc().subtract(1, 'month').format('YYYY-MM-DD'),
    breakdownEnd: dayjs.utc().format('YYYY-MM-DD'),
    selectedAccounts: [],
};
export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
            state.categoriesLoaded = true;
        },
        setCategoriesError: (state, action) => {
            state.categoriesError = action.payload;
        },
        setCategoriesLoaded: (state, action) => {
            state.categoriesLoaded = action.payload;
        },
        updateCategoryBreakdown: (state, action) => {
            state.categoryBreakdown = action.payload;
            state.categoryBreakdownLoaded = true;
        },
        setCategoryBreakdownLoaded: (state, action) => {
            state.categoryBreakdownLoaded = action.payload;
        },
        updateSelectedCategoryBreakdown: (state, action) => {
            state.selectedCategoryBreakdown = action.payload;
            state.selectedCategoryBreakdownLoaded = true;
        },
        setSelectedCategoryBreakdownLoaded: (state, action) => {
            state.selectedCategoryBreakdownLoaded = action.payload;
        },
        updateSelectedCategoryActivity: (state, action) => {
            state.selectedCategoryActivity = action.payload;
            state.selectedCategoryActivityLoaded = true;
        },
        setSelectedCategoryActivityLoaded: (state, action) => {
            state.selectedCategoryActivityLoaded = action.payload;
        },
        updateBreakdownStart: (state, action) => {
            state.breakdownStart = action.payload;
        },
        updateBreakdownEnd: (state, action) => {
            state.breakdownEnd = action.payload;
        },
        updateSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        updateSelectedAccounts: (state, action) => {
            state.selectedAccounts = action.payload;
        },
    },
});
export const { setCategories, setCategoriesError, setCategoriesLoaded, updateCategoryBreakdown, setCategoryBreakdownLoaded, updateSelectedCategoryBreakdown, setSelectedCategoryBreakdownLoaded, updateSelectedCategoryActivity, setSelectedCategoryActivityLoaded, updateBreakdownStart, updateBreakdownEnd, updateSelectedCategory, updateSelectedAccounts, } = categoriesSlice.actions;
export default categoriesSlice.reducer;
