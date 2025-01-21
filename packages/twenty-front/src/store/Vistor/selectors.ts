import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const visitor = (state: RootState) => state.visitor;

export const visitorSelector = createSelector(visitor, (state) => state);
