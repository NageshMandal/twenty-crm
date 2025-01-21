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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(LoginSchema) });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      localStorage.setItem("token", res?.headers.authorization);
      await dispatch(getUserInfo());
      navigate(paths.main.automation.index);
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
              <h2 className='mt-20 font-normal text-center text-black text-28'>Welcome</h2>
              <div className='flex justify-center py-16'>
                <p className='font-medium text-gray-700 text-14'>
                  Log in to Demand to continue to Demand.
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
                <Input
                  isAuth
                  name='password'
                  type='password'
                  label='Password'
                  autoComplete='password'
                  register={register("password")}
                  suffix='Eye'
                  error={errors.password}
                />
                <Link to='/auth/forgot-pass'>
                  <p className='pt-6 pb-16 font-medium text-primary hover:text-primary text-14'>
                    Forgot your password?
                  </p>
                </Link>
                <div className='space-y-2 text-center'>
                  <Button type='submit' fullWidth isPending={isLoading}>
                    Log in
                  </Button>
                  <div className='flex justify-start gap-4 pt-6'>
                    <p className='font-medium text-gray-700 text-14'>Don't have an account yet?</p>
                    <Link
                      to='/auth/signup'
                      className='font-medium text-primary hover:text-primary text-14'
                    >
                      <p>Sign Up</p>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default LoginPage;
