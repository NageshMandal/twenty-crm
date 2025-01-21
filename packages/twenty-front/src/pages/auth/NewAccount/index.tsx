import { ElementsForm, CardElement, FieldName } from "@getopenpay/openpay-js-react";

import React, { useEffect, useRef, useState } from "react";
import {
  ICurrencyAndCountry,
  ICycle,
  ICycleTypeList,
  IPlan,
  ISelectOption,
  IShortedPlan,
  TPlanCycle,
} from "src/utils/types";
import { authApi } from "src/api/auth";
import { countries } from "src/utils/constants/country";

const cycleTypeList: ICycleTypeList = {
  DAILY: "daily",
  MONTHLY: "month",
  QUARTERLY: "quarterly",
  SEMIANNUAL: "semiannual",
  YEARLY: "yearly",
};

const cycles: ICycle[] = [
  {
    value: cycleTypeList.MONTHLY,
    title: "Monthly",
  },
];

const sortedPlans: IShortedPlan = {
  daily: [],
  month: [],
  quarterly: [],
  semiannual: [],
  yearly: [],
  year: [],
};

const handleSortedPlan = (plans: IPlan[]) => {
  plans.forEach((plan: IPlan) => {
    // sortedPlans[plan.period_unit].push(plan);
    if (plan.prices && plan.prices[0].billing_interval == "month") {
      sortedPlans.month.push(plan);
    }
  });
  console.log("sortedPlans: ", JSON.stringify(sortedPlans));
  return sortedPlans;
};

function CheckoutForm() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [planCycle, setPlanCycle] = useState<TPlanCycle>(cycles[0].value);
  const [plans, setPlans] = useState<IShortedPlan>();
  const [planLoading, setPlanLoading] = useState(true);
  const [isSingUpLoading, setSignUpLoading] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string>("");
  const [checkoutSecureToken, setCheckoutSecureToken] = useState<string>("");
  const [currencyAndCountry, setCurrencyAndCountry] = useState<ICurrencyAndCountry>();
  const [invToken, setInvToken] = useState<string | null>(null);

  const onLoad = (totalAmountAtoms: number) => {
    setAmount(`$${totalAmountAtoms / 100}`);
  };

  const onCheckoutError = (message: string) => {
    setError(message);
  };

  const onCheckoutSuccess = (invoiceUrls: string[]) => {
    // Invoice URLs are returned here
    console.log("invoiceUrls", invoiceUrls);
  };

  useEffect(() => {
    if (plans && planCycle) {
      // console.log("plans ,,, ", JSON.stringify(plans));
      const result = plans[planCycle]?.find((item) => item?.name?.includes("AI SDR Pro"));
      if (result) {
        setCurrentPlanId(result.id);
      }
    }
  }, [plans, planCycle]);

  const getPlanInfo = async (currency: string) => {
    try {
      setPlanLoading(true);
      const params = {
        currency,
      };
      setPlans(null);
      const res = await authApi.getOpenpayPlans(params);
      const secureTokenObject = res?.data?.find((item) => item.secure_token);
      setCheckoutSecureToken(secureTokenObject?.secure_token);
      const shortedPlan = handleSortedPlan(res?.data);
      setPlans(shortedPlan);
    } catch (error1) {
      console.error("error: ", error1);
    }
    setPlanLoading(false);
  };

  const getCountryCurrency = async () => {
    try {
      const res = await authApi.getUserInfoByIp();
      setCurrencyAndCountry(res?.data);
      getPlanInfo(res?.data?.currency);
      // setValue(
      //   "country",
      //   countries.find((item) => item.name === res.data.country)?.code?.toLowerCase()
      // );
    } catch (error1) {
      console.error("error: ", error1);
    }
  };

  useEffect(() => {
    const search = window.location.search;

    if (~search.indexOf("inv_token")) {
      const token = search.split("=")[1];
      setInvToken(token);
    }
    getCountryCurrency();
  }, []);

  const changeCurrentPlan = async (planId: string) => {
    try {
      setPlanLoading(true);
      setCurrentPlanId(planId);
      const plan = plans[planCycle]?.find((item) => item.id === planId);
      const res = await authApi.getOpenpayCheckout({ plan: plan });
      const secureTokenObject = res?.data?.find((item) => item.secure_token);
      setCheckoutSecureToken(secureTokenObject?.secure_token);
      setPlanLoading(false);
    } catch (error1) {
      console.error("error: ", error1);
    }
  };

  return (
    <ElementsForm
      checkoutSecureToken={`checkout-secure-token-uuid`}
      onChange={() => setError(undefined)}
      onLoad={onLoad}
      onValidationError={(message) => setError(message)}
      onCheckoutSuccess={onCheckoutSuccess}
      onCheckoutError={onCheckoutError}
    >
      {({ submit }) => (
        <>
          <div>
            <input type='text' placeholder={"Given name"} data-opid={FieldName.FIRST_NAME} />
            <input type='text' placeholder={"Family name"} data-opid={FieldName.LAST_NAME} />
            <input type='email' placeholder={"Email"} data-opid={FieldName.EMAIL} />
            <input type='text' placeholder={"Country"} data-opid={FieldName.COUNTRY} />
            <input type='text' placeholder={"ZIP"} data-opid={FieldName.ZIP_CODE} />
          </div>

          <div>
            <CardElement />
          </div>

          {error && <small>{error}</small>}

          <button onClick={submit}>Pay {amount}</button>
        </>
      )}
    </ElementsForm>
  );
}

const NewAccount: React.FC = () => {
  return <CheckoutForm />;
};

export default NewAccount;
