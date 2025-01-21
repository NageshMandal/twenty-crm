import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectAutomation = (state: RootState) => state.automation;

export const automationSelector = createSelector(selectAutomation, (state) => state);
