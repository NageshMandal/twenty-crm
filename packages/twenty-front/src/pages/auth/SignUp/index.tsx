import React, { useEffect, useRef, useState } from "react";
import ReactLoading from "react-loading";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";

import Button from "src/components/base/Button";
import Container from "src/components/base/Container";
import Icon from "src/components/base/Icon";
import adobe from "src/assets/logos/logo_rgb/adobe.png";
import google from "src/assets/logos/logo_rgb/google.png";
import ibm from "src/assets/logos/logo_rgb/ibm.png";
import oracle from "src/assets/logos/logo_rgb/oracle.png";
import sap from "src/assets/logos/logo_rgb/sap.png";
import stripe from "src/assets/logos/logo_rgb/stripe.png";
import { authApi } from "src/api/auth";
import { Helmet } from "react-helmet-async";
import { ElementsForm, FieldName, CardElement } from "@getopenpay/openpay-js-react";
import { FC, PropsWithChildren } from "react";

const companyList = [google, ibm, adobe, oracle, sap, stripe];

const SignUpPage: React.FC = () => {
  const [plans, setPlans] = useState<any>();
  const navigate = useNavigate();

  const [planLoading, setPlanLoading] = useState(true);
  const [isSingUpLoading, setSignUpLoading] = useState(false);

  const [currentPlanId, setCurrentPlanId] = useState<string>("");

  const [invToken, setInvToken] = useState<string | null>(null);
  const [isStagingEnv, setIsStagingEnv] = useState(true);
  const [checkoutSecureToken, setCheckoutSecureToken] = useState<string>("");

  useEffect(() => {
    if (plans) {
      // console.log("plans ,,, ", JSON.stringify(plans));
      const result = plans?.find((item) => item?.name?.includes("AI SDR Pro"));
      if (result) {
        setCurrentPlanId(result.id);
      }
    }
  }, []);

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
      console.log("data received: ", res?.data);
      const shortedPlan =
        res?.data?.filter((item) => item.prices?.[0]?.billing_interval === "month") || [];
      setPlans(shortedPlan);
      console.log("plans got sorted:", plans);
    } catch (error) {
      console.error("error: ", error);
    }
    setPlanLoading(false);
  };

  useEffect(() => {
    try {
      getPlanInfo("usd");
    } catch (error) {
      console.error("error: ", error);
    }
  }, []);

  const changeCurrentPlan = async (planId: string) => {
    try {
      setPlanLoading(true);
      setCurrentPlanId(planId);
      const plan = plans?.find((item) => item.id === planId);
      const res = await authApi.getOpenpayCheckout({ plan: plan });
      const secureTokenObject = res?.data?.find((item) => item.secure_token);
      setCheckoutSecureToken(secureTokenObject?.secure_token);
      setPlanLoading(false);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  interface InputProps {
    type?: string;
    placeholder: string;
    openPayId?: FieldName;
  }

  const Input: FC<InputProps> = ({ type, placeholder, openPayId }) => (
    <input
      type={type ?? "text"}
      placeholder={placeholder}
      className='w-full text-base outline-none py-12 px-1 text-black'
      data-opid={openPayId}
    />
  );

  const StyledWrapper: FC<PropsWithChildren> = (props) => {
    const { children } = props;
    return (
      <div className='shadow-md px-4 py-4 rounded-md mb-4 text-white bg-black'>{children}</div>
    );
  };

  const HorizontalRule: FC = () => <hr className='border-emerald-200 dark:border-emerald-700' />;

  const [error, setError] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const onLoad = (totalAmountAtoms: number) => {
    setAmount(`$${totalAmountAtoms / 100}`);
  };

  const onCheckoutError = (message: string) => {
    setError(message);
  };

  return (
    <>
      <Helmet>
        <title> Salestools: Signup</title>
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
              <div className='px-20 space-y-10 overflow-auto tablet:px-40 tablet:h-300 desktop:h-380 large:h-600 h-600 scrollbar-thin scrollbar-thumb-gray-300'>
                <div className='flex items-center justify-center gap-10 py-16'>
                  <p className='font-medium text-gray-700 text-14'>{`I’m signing up to:`} </p>
                </div>
                {plans
                  ? plans.map(
                      (plan, index) =>
                        plan.name?.includes("AI SDR") && (
                          <div key={plan.id + index}>
                            <div
                              className={`flex justify-between px-4 py-4 border border-gray-300 select-none cursor-pointer ${
                                plan.id === currentPlanId ? "border-primary-3 bg-primary-4" : ""
                              }`}
                              onClick={() => changeCurrentPlan(plan.id)}
                            >
                              <div
                                className={`text-16 ${
                                  plan ? "text-primary-1 border-primary-3 bg-primary-4" : ""
                                }`}
                              >
                                {plan.name}
                              </div>
                              <p
                                className={`text-16 ${
                                  plan ? "text-primary-1 border-primary-3 bg-primary-4" : ""
                                }`}
                              >
                                {plan.prices[0].unit_amount_atom / 100}/
                                {plan.prices[0].billing_interval_count}{" "}
                                {plan.prices[0].billing_interval}
                              </p>
                            </div>
                            {plan.prices[0].recurring_details.trial_period_days ? (
                              <p className='font-normal text-black-700 text-18'>
                                {plan.prices[0].recurring_details.trial_period_days} days free trial
                                starting today cancel anytime. you will be charged on{" "}
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
                {currentPlanId && !planLoading && (
                  <ElementsForm
                    baseUrl={
                      isStagingEnv
                        ? "https://cde.openpaystaging.com/"
                        : "https://cde.getopenpay.com"
                    }
                    checkoutSecureToken={checkoutSecureToken}
                    onChange={() => setError(undefined)}
                    onLoad={onLoad}
                    onValidationError={(message) => setError(message)}
                    onSetupPaymentMethodSuccess={(paymentMethodId) => {
                      // Callback for successful setup
                      // Handle setup success
                    }}
                    onCheckoutSuccess={(invoiceUrls, subscriptionIds, customerId) => {
                      // Handle checkout success (only in 'SUBSCRIPTION' or 'PAYMENT' modes)
                    }}
                    onCheckoutError={onCheckoutError}
                  >
                    {({ submit }) => (
                      <>
                        <StyledWrapper>
                          <div className='flex gap-2 items-center justify-between'>
                            <Input placeholder='First name' openPayId={FieldName.FIRST_NAME} />
                            <Input placeholder='Last name' openPayId={FieldName.LAST_NAME} />
                          </div>
                          <HorizontalRule />
                          <Input
                            placeholder='Email address'
                            type='email'
                            openPayId={FieldName.EMAIL}
                          />
                          <HorizontalRule />
                          <div className='flex gap-2 items-center justify-between'>
                            <Input placeholder='Country' openPayId={FieldName.COUNTRY} />
                            <Input placeholder='ZIP' openPayId={FieldName.ZIP_CODE} />
                          </div>
                        </StyledWrapper>

                        <StyledWrapper>
                          <CardElement />
                        </StyledWrapper>

                        {error && (
                          <small className='font-bold text-xs mt-2 text-red-500'>{error}</small>
                        )}
                        <Button
                          onClick={submit}
                          disabled={planLoading || !currentPlanId}
                          type='submit'
                          fullWidth
                          isPending={isSingUpLoading}
                        >
                          Sign Up
                        </Button>
                      </>
                    )}
                  </ElementsForm>
                )}
                <div className='space-y-2 text-center pb-20'>
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
                  </div>
                  <div className='flex justify-start gap-4 pt-6 pb-10'>
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
              </div>
            </div>
            <div className='hidden min-w-250 bg-text-100 p-30 tablet:block mt-40'>
              <p className='pb-20 font-medium text-black text-16 text-start whitespace-nowrap'>
                {plans && (
                  <span className='text-primary'>
                    {plans.find((item) => item.id === currentPlanId)?.name}
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

export default SignUpPage;
