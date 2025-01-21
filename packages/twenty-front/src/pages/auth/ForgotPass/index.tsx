import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "src/components/base/Button";
import Container from "src/components/base/Container";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";
import { LoginSchema } from "src/utils/schema/login";
import { authApi } from "src/api/auth";
import { getUserInfo } from "src/store/Auth";
import { paths } from "src/routes/path";
import { useAppDispatch } from "src/hook/redux/useStore";
import { Helmet } from "react-helmet-async";
import { ForgotPassSchema } from "src/utils/schema/forgotPass";

const ForgotPassPage: React.FC = () => {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(ForgotPassSchema) });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.forgotPass({ email: data?.email });
      // localStorage.setItem("token", res?.headers.authorization);
      toast.success("Password reset link sent to your email.");
      // await dispatch(getUserInfo());
      // navigate(paths.main.automation.index);
    } catch (error: any) {
      toast.error(error?.response?.data?.errors?.email[0] ?? error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title> Demand: Login</title>
        <meta name='' content='' />
      </Helmet>
      <Container className='flex items-center justify-center min-h-screen bg-bodyBgColor-dark'>
        <div className='flex w-full min-h-full py-12'>
          <div className='w-full max-w-md mx-auto mt-10'>
            <div className='px-20 border border-gray-200 shadow-md bg-contentColor tablet:px-40 py-50 phone:rounded-lg'>
              <div className='flex items-center justify-center gap-6'>
                <Icon name='Logo' className='w-45 h-45' />
                <h2 className='font-medium text-38 text-primary'>Demand</h2>
              </div>
              <h2 className='mt-20 font-normal text-center text-black text-28'>
                Forgot your password?
              </h2>
              <div className='flex justify-center py-16'>
                <p className='font-medium text-gray-700 text-14'>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>
              <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                <Input
                  isAuth
                  name='email'
                  type='text'
                  label='Email address'
                  autoComplete='email'
                  register={register("email")}
                  error={errors.email}
                />
                <Link to='/auth/login'>
                  <p className='pt-6 pb-16 font-medium text-primary hover:text-primary text-14'>
                    Go Back to Login
                  </p>
                </Link>
                <div className='space-y-2 text-center'>
                  <Button type='submit' fullWidth isPending={isLoading}>
                    Send Rest Link
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ForgotPassPage;
