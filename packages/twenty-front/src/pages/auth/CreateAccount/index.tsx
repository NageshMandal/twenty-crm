import React, { useEffect, useRef, useState } from "react";
import ReactLoading from "react-loading";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, FieldValues, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CardComponent,
  CardNumber,
  CardExpiry,
  CardCVV,
} from "@chargebee/chargebee-js-react-wrapper";

import Button from "src/components/base/Button";
import Checkbox from "src/components/base/Checkbox";
import Container from "src/components/base/Container";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";
import adobe from "src/assets/logos/logo_rgb/adobe.png";
import google from "src/assets/logos/logo_rgb/google.png";
import ibm from "src/assets/logos/logo_rgb/ibm.png";
import oracle from "src/assets/logos/logo_rgb/oracle.png";
import sap from "src/assets/logos/logo_rgb/sap.png";
import stripe from "src/assets/logos/logo_rgb/stripe.png";
import { countries } from "src/utils/constants/country";
import {
  ICurrencyAndCountry,
  ICycle,
  ICycleTypeList,
  IPlanBkp,
  ISelectOption,
  IShortedPlan,
  IShortedPlanBkp,
  TPlanCycle,
} from "src/utils/types";
import { SignUpSchema } from "src/utils/schema/signup";
import { authApi } from "src/api/auth";
import ReactSelect from "src/components/base/ReactSelect";
import { Helmet } from "react-helmet-async";

const companyList = [google, ibm, adobe, oracle, sap, stripe];

const CountryOptions = countries?.map((item) => ({
  label: item.name,
  value: item.code?.toLowerCase(),
}));

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

const sortedPlans: IShortedPlanBkp = {
  daily: [],
  month: [],
  quarterly: [],
  semiannual: [],
  yearly: [],
  year: [],
};

const handleSortedPlan = (plans: IPlanBkp[]) => {
  plans.forEach((plan: IPlanBkp) => {
    sortedPlans[plan.period_unit].push(plan);
  });
  return sortedPlans;
};

const CreateAccountPage: React.FC = () => {
  const [planCycle, setPlanCycle] = useState<TPlanCycle>(cycles[0].value);
  const [plans, setPlans] = useState<IShortedPlanBkp>();
  const [active, setActive] = useState({ card: false, till: false, cvv: false });

  const navigate = useNavigate();

  const cardRef = useRef<any>();
  const [currencyAndCountry, setCurrencyAndCountry] = useState<ICurrencyAndCountry>();

  const [planLoading, setPlanLoading] = useState(true);
  const [isSingUpLoading, setSignUpLoading] = useState(false);

  const [currentPlanId, setCurrentPlanId] = useState<string>("");

  const [isPromoCode, setIsPromoCode] = useState(false);
  const [invToken, setInvToken] = useState<string | null>(null);

  useEffect(() => {
    if (plans && planCycle) {
      console.log("plans ,,, ", JSON.stringify(plans));
      const result = plans[planCycle]?.find(
        (item) =>
          item?.id?.includes("saleshub-pro-monthly") ||
          item?.id?.includes("aisdr-starter") ||
          item?.id?.includes("aisdr-pro") ||
          item?.id?.includes("aisdr-enterprise")
      );
      // copy_of_free-saleshub
      // const result = plans[planCycle]?.find((item) => item?.id?.includes("copy_of_free-saleshub"));
      if (result) {
        setCurrentPlanId(result.id);
      }
    }
  }, [plans, planCycle]);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(SignUpSchema) });

  const getPlanInfo = async (currency: string) => {
    try {
      setPlanLoading(true);
      const params = {
        currency,
      };
      const res = await authApi.getPlan(params);
      const shortedPlan = handleSortedPlan(res?.data);
      setPlans(shortedPlan);
    } catch (error) {
      console.error("error: ", error);
    }
    setPlanLoading(false);
  };

  const getCountryCurrency = async () => {
    try {
      const res = await authApi.getUserInfoByIp();
      setCurrencyAndCountry(res?.data);
      getPlanInfo(res?.data?.currency);
      setValue(
        "country",
        countries.find((item) => item.name === res.data.country)?.code?.toLowerCase()
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getPrice = (price: string) => {
    if (planCycle === cycleTypeList.MONTHLY && currencyAndCountry?.currency)
      return parseFloat(price).toLocaleString("en-US", {
        style: "currency",
        currency: currencyAndCountry?.currency,
      });
    return Math.ceil(parseFloat(price));
  };

  const onSubmit = async (data: FieldValues) => {
    setSignUpLoading(true);
    let requestData: any = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      password_confirmation: data.password,
      plan_id: currentPlanId,
      promocode: data.promocode,
    };

    if (invToken) {
      requestData = { ...data, inv_token: invToken };
      delete data.plan_id;
    }

    const dataPayment = {
      plan_quantity: 1,
      payment_intent_id: "",
      email: data.email,
      plan_id: currentPlanId,
      addons:
        currentPlanId === "saleshub-pro-monthly"
          ? JSON.stringify([{ id: "mobile-numbers-", quantity: 50 }])
          : [],
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      password_confirmation: data.password,
      zip_code: data.zip,
      state: "",
      city: "",
      address_1: "",
      address_2: "",
      phone: "",
      // country_code: data.country ? data?.country?.code?.toUpperCase() : "",
      country_code: data.country
        ? data?.country?.toUpperCase()
        : getValues("country").toUpperCase() ?? "",
    };

    const additionalData = {
      billingAddress: {
        firstName: data.first_name,
        lastName: data.last_name,
        phone: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        // country: data.country ? data?.country?.code?.toUpperCase() : "",
        country_code: data.country
          ? data?.country?.toUpperCase()
          : getValues("country").toUpperCase() ?? "",
        zip: data.zip,
      },
    };

    try {
      if (invToken) {
        authApi.registerUser(requestData);
      }
      const reqInfo = {
        plan_id: currentPlanId,
        addons:
          currentPlanId === "saleshub-pro-monthly"
            ? JSON.stringify([{ id: "mobile-numbers-", quantity: 50 }])
            : [],
      };
      type TEstimate = {
        invoice_estimate: { total: number };
      };
      const estimateRes = await authApi.subscriptionEstimate(reqInfo);
      const estimate = estimateRes?.data as unknown as TEstimate;

      if (estimate) {
        if (
          currentPlanId === "free-saleshub" ||
          currentPlanId === "copy_of_free-saleshub" ||
          invToken
        ) {
          await authApi.registerUser(dataPayment);
        } else {
          const res = await authApi.createPaymentIntent({
            currency: currencyAndCountry?.currency,
            // price: estimate?.invoice_estimate?.total,
            price: 100,
          });
          const indent = res?.data;
          if (indent && cardRef) {
            const result = await cardRef?.current?.authorizeWith3ds(indent, additionalData);
            if (result) {
              const params = {
                ...dataPayment,
                payment_intent_id: result.id ?? result?.data?.id,
              };
              await authApi.registerUser(params);
            }
          }
        }
      }
      toast.success("You successfully registered!");
      navigate("auth/login");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message ?? error?.message);
    }

    setSignUpLoading(false);
  };

  useEffect(() => {
    const search = window.location.search;

    if (~search.indexOf("inv_token")) {
      const token = search.split("=")[1];
      setInvToken(token);
    }
    getCountryCurrency();
  }, []);

  return (
    <>
      <Helmet>
        <title> Salestools: Create Account</title>
        <meta name='' content='' />
      </Helmet>

      <Container className='flex items-center justify-center h-screen overflow-hidden'>
        <div className='flex items-center justify-center h-full py-12 mx-auto mt-10'>
          <div className='flex border border-gray-200 shadow-md bg-bodyBgColor phone:rounded-lg'>
            <div className='py-50'>
              <div className='flex items-center justify-center gap-6'>
                <Icon name='Logo' className='w-45 h-45' />
                <h2 className='font-medium text-38 text-primary'>Salestools AI Agents</h2>
              </div>
              <h2 className='px-16 mt-20 font-normal text-center text-black text-28'>
                Start My Free Trial
              </h2>

              <form
                className='px-20 space-y-10 overflow-auto tablet:px-40 tablet:h-300 desktop:h-380 large:h-600 h-600 scrollbar-thin scrollbar-thumb-gray-300'
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='flex items-center justify-center gap-10 py-16'>
                  <p className='font-medium text-gray-700 text-14'>{`I’m signing up to:`} </p>
                  {planLoading ? (
                    <ReactLoading type='spin' width={20} height={20} color='#2285E1' />
                  ) : (
                    cycles.map((cycle, index) => (
                      <p
                        key={cycle.value + index}
                        onClick={() => {
                          setPlanCycle(cycle.value);
                        }}
                        className={`text-14 border rounded-lg px-4 py-1 select-none cursor-pointer ${
                          cycle.value === planCycle
                            ? "border-primary-3 bg-primary-4 text-primary"
                            : "border-gray-400 text-gray-700 "
                        }`}
                      >
                        {cycle.title}
                      </p>
                    ))
                  )}
                </div>
                {plans && planCycle
                  ? plans[planCycle].map(
                      (plan, index) =>
                        plan.id?.includes("saleshub-pro-monthly") && (
                          <div key={plan.id + index}>
                            <div
                              className={`flex justify-between px-4 py-4 border border-gray-300 select-none cursor-pointer ${
                                plan.id === currentPlanId ? "border-primary-3 bg-primary-4" : ""
                              }`}
                              onClick={() => setCurrentPlanId(plan.id)}
                            >
                              <div
                                className={`text-16 ${
                                  planCycle ? "text-primary-1 border-primary-3 bg-primary-4" : ""
                                }`}
                              >
                                {plan.name}
                              </div>
                              <p
                                className={`text-16 ${
                                  planCycle ? "text-primary-1 border-primary-3 bg-primary-4" : ""
                                }`}
                              >
                                {getPrice(plan.price)}/month
                              </p>
                            </div>
                            {plan.trial_period ? (
                              <p className='font-normal text-black-700 text-18'>
                                {plan.trial_period} days free trial starting today cancel anytime.
                                you will be charged on{" "}
                                {new Date(
                                  Date.now() + 8 * 24 * 60 * 60 * 1000
                                ).toLocaleDateString()}{" "}
                                and each month thereafter until you cancel.
                              </p>
                            ) : null}
                          </div>
                        )
                    )
                  : null}
                <div className='grid grid-cols-2 gap-12 pt-10'>
                  <Input
                    isAuth
                    type='text'
                    label='First Name'
                    register={register("first_name")}
                    error={errors.first_name}
                  />
                  <Input
                    isAuth
                    type='text'
                    label='Last Name'
                    register={register("last_name")}
                    error={errors.last_name}
                  />
                </div>
                <Controller
                  name='country'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <ReactSelect
                      label='Country'
                      isAuth
                      options={CountryOptions ?? []}
                      value={CountryOptions?.find(
                        (option: ISelectOption) => option.value === value
                      )}
                      onChange={(option: ISelectOption) => {
                        if (option) {
                          // console.log("option value", option);
                          onChange(option?.value);
                        }
                      }}
                    />
                  )}
                />
                {!invToken && !isPromoCode && (
                  <p
                    className='px-4 underline cursor-pointer text-primary'
                    onClick={() => setIsPromoCode(true)}
                  >
                    Got a coupon?
                  </p>
                )}
                {isPromoCode && (
                  <Input
                    isAuth
                    type='text'
                    label='PromoCode'
                    register={register("promocode")}
                    error={errors.promocode}
                  />
                )}
                <Input
                  isAuth
                  type='text'
                  label='Email address'
                  register={register("email")}
                  error={errors.email}
                />
                <Input
                  isAuth
                  type='password'
                  label='Password'
                  register={register("password")}
                  suffix='Eye'
                  error={errors.password}
                />
                {currentPlanId === "free-saleshub" ||
                currentPlanId === "copy_of_free-saleshub" ||
                !currentPlanId ||
                invToken ? null : (
                  <Input
                    type='text'
                    isAuth
                    label='Zip Code'
                    register={register("zip")}
                    error={errors.zip}
                  />
                )}
                <CardComponent ref={cardRef} className='field'>
                  <div className='flex flex-col'>
                    <label className='block px-5 mb-1 font-normal text-14 text-neutral-800'>
                      Card Number
                    </label>
                    <CardNumber
                      onBlur={() => setActive((prev) => ({ ...prev, card: false }))}
                      onFocus={() => setActive((prev) => ({ ...prev, card: true }))}
                      placeholder='0000 0000 0000 0000'
                      className={`block w-full appearance-none rounded-md border bg-contentColor border-gray-300 px-12 py-10 placeholder-gray-400 shadow-sm phone:text-16  focus:outline-none ${
                        active.card ? "border-primary ring-primary ring-1" : ""
                      } `}
                    />
                  </div>
                  <div className='flex gap-6 pt-10'>
                    <div className='flex flex-col w-full'>
                      <label className='block px-5 mb-1 font-normal text-14 text-neutral-800'>
                        Valid Till
                      </label>
                      <CardExpiry
                        onBlur={() => setActive((prev) => ({ ...prev, till: false }))}
                        onFocus={() => setActive((prev) => ({ ...prev, till: true }))}
                        placeholder='MM / YY'
                        className={`block w-full appearance-none rounded-md border bg-contentColor border-gray-300 px-12 py-10 placeholder-gray-400 shadow-sm phone:text-16  focus:outline-none ${
                          active.till ? "border-primary ring-primary ring-1" : ""
                        } `}
                      />
                    </div>
                    <div className='flex flex-col w-full'>
                      <label className='block px-5 mb-1 font-normal text-14 text-neutral-800'>
                        CVV
                      </label>
                      <CardCVV
                        onBlur={() => setActive((prev) => ({ ...prev, cvv: false }))}
                        onFocus={() => setActive((prev) => ({ ...prev, cvv: true }))}
                        placeholder='CVV'
                        className={`block w-full appearance-none rounded-md border bg-contentColor border-gray-300 px-12 py-10 placeholder-gray-400 shadow-sm phone:text-16  focus:outline-none ${
                          active.cvv ? "border-primary ring-primary ring-1" : ""
                        } `}
                      />
                    </div>
                  </div>
                </CardComponent>
                <div className='flex flex-col w-full gap-10 py-10 max-w-500'>
                  <h2 className='font-medium text-16'> What you need to know </h2>
                  <p className='text-gray-500'>
                    If you purchase an account you are not entitled to a refund, secondly all trials
                    they are automatically billed after 7 days, unless you cancel we offer self
                    service cancellation from your settings page, accordingly to
                    <a href='https://usedemand.com/termsOfService'>the terms section 15</a>. We do
                    not provide refunds if you decide to stop using the Demand subscription during
                    your Subscription Term.
                  </p>
                  <p className='text-gray-500'>
                    Your Subscription Term will automatically renew for the choosen period monthly
                    or annually, unless you tell us that you don’t want to renew by providing notice
                    or cancel from your Settings page as required in the
                    <a href='https://usedemand.com/termsOfService'>Terms fo service.</a> I have
                    read, understand and accept the Demand Terms, I agree that Demand is authorized
                    to charge me for all fees due during the Subscription Term and any renewal
                    terms. I certify that I am authorized to sign and enter into this binding legal
                    contract for the company or organization making this purchase.
                  </p>
                </div>
                <Checkbox
                  control={control}
                  name='term'
                  isAuth
                  className='flex-none w-18 h-18'
                  label='I agree to the terms of Demand'
                />
                <div className='space-y-2 text-center pb-20'>
                  <Button
                    disabled={planLoading || !currentPlanId || !isValid}
                    type='submit'
                    fullWidth
                    isPending={isSingUpLoading}
                  >
                    Sign Up
                  </Button>
                  <div className='flex justify-start gap-4 pt-6 pb-10'>
                    <p className='font-medium text-neutral-800 text-14'>Already have an account?</p>
                    <Link
                      to='/auth/login'
                      className='font-medium text-primary hover:text-primary text-14'
                    >
                      <p>Log in</p>
                    </Link>
                  </div>
                  <div className='flex justify-start gap-4 pt-6 pb-10'>
                    <div className='font-medium text-neutral-800 text-14'>
                      Please read additional information in our
                      <Link
                        to='https://usedemand.com/termsOfService'
                        className='font-medium text-primary hover:text-primary text-14'
                      >
                        <span> Terms and Subscriptions </span>
                      </Link>
                      <span>Regarding your subscription</span>
                    </div>
                    {/* <Link
                      to='https://usedemand.com/termsOfService'
                      className='font-medium text-primary hover:text-primary text-14'
                    >
                      <p>Read Terms and Conditions</p>
                    </Link> */}
                  </div>
                  <div className='flex justify-start gap-4 pt-6 pb-10'>
                    {/* <p className='font-medium text-neutral-800 text-14'>
                      Want to study our Privacy Policy?
                    </p>
                    <Link
                      to='https://usedemand.com/privacyPolicy'
                      className='font-medium text-primary hover:text-primary text-14'
                    >
                      <p>Read Privacy Policy</p>
                    </Link> */}
                    <p className='font-medium text-neutral-800 text-14'>
                      Read our
                      <Link
                        to={"https://usedemand.com/privacyPolicy"}
                        className='font-medium text-primary hover:text-primary text-14'
                      >
                        <span> Privacy Policy</span>
                      </Link>
                    </p>
                  </div>
                  <div className='flex justify-start gap-4 pt-6 pb-10'>
                    <p className='font-medium text-neutral-800 text-14'>
                      Want to study our Data Terms?
                    </p>
                    <Link
                      to='https://usedemand.com/dataTerms'
                      className='font-medium text-primary hover:text-primary text-14'
                    >
                      <p>Read Data Terms</p>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
            <div className='hidden min-w-250 bg-text-100 p-30 tablet:block'>
              <p className='pb-20 font-medium text-black text-16 text-start whitespace-nowrap'>
                {plans && planCycle && (
                  <span className='text-primary'>
                    {plans[planCycle].find((item) => item.id === currentPlanId)?.name}
                  </span>
                )}
              </p>
              <p className='pb-20 font-medium text-black text-16 text-start whitespace-nowrap'>
                JOIN 10,000+ COMPANIES
              </p>
              <div className='grid grid-cols-2 gap-10'>
                {companyList.map((item, index) => (
                  <img key={index} width={100} height={80} src={item} alt='image' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default CreateAccountPage;
