import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectLeads = (state: RootState) => state.leads;

export const leadSelector = createSelector(selectLeads, (state) => state);
