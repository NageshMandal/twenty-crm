import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectPersonalization = (state: RootState) => state.personalization;

export const personalizationSelector = createSelector(selectPersonalization, (state) => state);
