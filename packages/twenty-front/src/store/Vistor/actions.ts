import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { visitorApi } from "src/api/visitor";
import { IEmailDeveloper, IVisitorAccount } from "src/utils/types/visitor";
import { commonApi } from "../../api/common";

export const handleGetAccount = createAsyncThunk("visitor/account", async () => {
  try {
    const response = await visitorApi.handleGetAccount();
    return response;
  } catch (error) {
    throw (
      error?.response?.data?.errors?.email[0] ?? error?.response?.data?.message ?? error.message
    );
  }
});

export const handleUpdateAccount = createAsyncThunk(
  "visitor/account_update",
  async (data: Partial<IVisitorAccount>) => {
    try {
      await visitorApi.handleUpdateAccount(data);
      return data;
    } catch (error) {
      throw (
        error?.response?.data?.errors?.email[0] ?? error?.response?.data?.message ?? error.message
      );
    }
  }
);

export const sendDeveloperEmail = createAsyncThunk(
  "visitor/email_developer",
  async (data: IEmailDeveloper) => {
    try {
      await visitorApi.sendEmailToDeveloper(data);
      toast.success("Email was successfully sent!");
      return data;
    } catch (error) {
      throw (
        error?.response?.data?.errors?.email[0] ?? error?.response?.data?.message ?? error.message
      );
    }
  }
);

export const getAutomations = createAsyncThunk("prospect/automations", async () => {
  try {
    const response = await commonApi.getWorkflow({ event_filter: "my_contact" });
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});
