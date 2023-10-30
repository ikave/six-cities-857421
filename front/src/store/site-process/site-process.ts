import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { SiteProcess } from '../../types/state';
import type { CityName, SortName } from '../../types/types';
import { CityLocation, Sorting, StoreSlice } from '../../const';
import { fetchCities } from '../action';

const initialState: SiteProcess = {
  city: {
    name: '',
    location: CityLocation[''],
  },
  cities: [],
  sorting: Sorting.Popular,
};

export const siteProcess = createSlice({
  name: StoreSlice.SiteProcess,
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<CityName>) => {
      state.city = {
        name: action.payload,
        location: CityLocation[action.payload],
      };
    },
    setSorting: (state, action: PayloadAction<SortName>) => {
      state.sorting = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCities.fulfilled, (state, action) => {
      state.city = action.payload[0];
      state.cities = action.payload;
    });
  },
});

export const { setCity, setSorting } = siteProcess.actions;
