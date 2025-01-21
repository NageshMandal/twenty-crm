import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "src/components/base/Button";
import Container from "src/components/base/Container";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";
import { authApi } from "src/api/auth";
import { Helmet } from "react-helmet-async";
import { RestorePassSchema } from "src/utils/schema/restorePass";
import { paths } from "src/routes/path";

const RestorePassPage: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(RestorePassSchema) });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get("reset_token");

  const onSubmit = async (data: any) => {
    // console.log("onsubmit");
    setIsLoading(true);
    try {
      const params = {
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        reset_token: resetToken || "",
      };
      const res = await authApi.restorePass(params);
      // localStorage.setItem("token", res?.headers.authorization);
      toast.success("Password Restored");
      // await dispatch(getUserInfo());
      navigate(paths.auth.login);
    } catch (error: any) {
      toast.error(
        "Please Reset Password Again " +
          error?.response?.data?.message +
          " " +
          JSON.stringify(error?.response?.data?.errors) ?? "Error restoring password"
      );
      // console.log("error: ", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Demand</title>
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
              <h2 className='mt-20 font-normal text-center text-black text-28'>Restore Password</h2>
              <div className='flex justify-center py-16'>
                <p className='font-medium text-gray-700 text-14'></p>
              </div>
              <form className='space-y-12' onSubmit={handleSubmit(onSubmit)}>
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
                <Input
                  isAuth
                  name='password_confirmation'
                  type='password'
                  label='Repeat Password'
                  autoComplete='password'
                  register={register("password_confirmation")}
                  suffix='Eye'
                  error={errors.password}
                />
                {/* <Link to='/auth/login'>
                  <p className='pt-6 pb-16 font-medium text-primary hover:text-primary text-14'>
                    Go Back to Login
                  </p>
                </Link> */}
                <div className='space-y-2 text-center pt-10'>
                  <Button type='submit' fullWidth isPending={isLoading}>
                    Restore
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

export default RestorePassPage;
