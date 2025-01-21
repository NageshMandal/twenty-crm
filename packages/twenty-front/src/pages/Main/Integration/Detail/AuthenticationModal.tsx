import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import ReactLoading from "react-loading";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import Modal from "src/components/base/Modal";
import { IIntegration, IShowIntegration } from "src/utils/types/integration";
import { integrationApi } from "src/api/integration";

type Props = {
  showAuthModal: boolean;
  setShowAuthModal: Function;
  isShowLoading: boolean;
  integration: IIntegration;
  showInfo?: IShowIntegration;
  handleShowIntegration: Function;
};

const AuthenticationModal: React.FC<Props> = ({
  showAuthModal,
  setShowAuthModal,
  isShowLoading,
  integration,
  showInfo,
  handleShowIntegration,
}) => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const validationSchema = useMemo(() => {
    if (showInfo && showInfo?.auth_fields) {
      let validObj: any = {};
      showInfo.auth_fields?.forEach((item) => {
        if (item.required) {
          validObj = {
            ...validObj,
            [item.name]: yup
              .string()
              .required(
                `${item.name
                  .replace(/\b\w/g, (c) => c.toUpperCase())
                  .replace(/_/g, " ")} is required field.`
              ),
          };
        }
      });
      const schema = yup.object(validObj);
      return schema;
    } else {
    }
  }, [showInfo]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmitAuthentication = async (data: FieldValues) => {
    setIsAuthLoading(true);
    try {
      const res = (await integrationApi.authIntegration(integration?.slug, data)) as unknown as any;
      if (res?.redirect_url) {
        window.open(res?.redirect_url, "_blank");
        handleShowIntegration();
      }
    } catch (error) {
      console.error("error: ", error);
    }
    reset();
    setShowAuthModal(false);
    setIsAuthLoading(false);
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await integrationApi.logoutIntegration(integration?.slug);
      await handleShowIntegration();
      toast.success(`You have successfully logged out from ${integration?.name}`);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLogoutLoading(false);
    setShowAuthModal(false);
  };

  useEffect(() => {
    reset();
  }, [showAuthModal]);

  return (
    <Modal show={showAuthModal} onClose={() => setShowAuthModal(false)}>
      {isShowLoading || !integration ? (
        <div className='flex items-center justify-center h-150 w-550'>
          <ReactLoading className='mt-25' type={"spin"} color='#2285E1' width={40} />
        </div>
      ) : (
        <div className='px-20 pt-16 pb-6 w-550'>
          <h2 className='pb-20 font-normal text-center text-20 dark:text-neutral-200 text-neutral-800'>
            {showInfo?.message ?? ""}
          </h2>
          <div>
            {showInfo && showInfo?.auth_fields ? (
              <form className='py-10' onSubmit={handleSubmit(onSubmitAuthentication)}>
                <div className='flex flex-col gap-16'>
                  {showInfo?.auth_fields?.map((item) => {
                    return (
                      <div key={item?.name} className='flex flex-col gap-4'>
                        <Input
                          label={item?.label}
                          register={register(item?.name ?? "")}
                          error={item.required ? errors[item.name] : undefined}
                          type={item?.type ?? "text"}
                        />
                        {item?.hint && <p className='px-6 title-1 text-14'>{item?.hint ?? ""}</p>}
                      </div>
                    );
                  })}
                </div>
                <div className='flex justify-center gap-16 pt-20'>
                  <Button type='submit' isPending={isAuthLoading}>
                    Login
                  </Button>
                  <Button buttonStyle='secondary' onClick={() => setShowAuthModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : null}
            {showInfo && showInfo?.oauth_url ? (
              <div className='flex justify-center'>
                <a
                  href={showInfo?.oauth_url}
                  target='_blank'
                  role='button'
                  className='underline text-primary'
                >{`Click here to login ${integration?.name}`}</a>
              </div>
            ) : null}
            {showInfo && showInfo?.status ? (
              <>
                <div className='flex justify-center'>
                  <p className='title-1'>
                    You are logged in{" "}
                    {showInfo?.crm_user_name &&
                      (!showInfo?.crm_url ? (
                        <span>
                          {" "}
                          as{" "}
                          <a
                            href={showInfo?.crm_url}
                            target='_blank'
                            className='font-semibold text-primary'
                          >
                            {showInfo?.crm_user_name}
                          </a>
                        </span>
                      ) : (
                        <span>
                          {" "}
                          as{" "}
                          <span className='font-semibold text-primary'>
                            {showInfo?.crm_user_name}
                          </span>
                        </span>
                      ))}
                  </p>
                </div>
                <div className='flex justify-center gap-16 pb-16 pt-30'>
                  <Button isPending={isLogoutLoading} onClick={() => handleLogout()}>
                    Logout
                  </Button>
                  <Button buttonStyle='secondary' onClick={() => setShowAuthModal(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AuthenticationModal;
