import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm, FieldValues } from "react-hook-form";
import * as yup from "yup";

import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import { useAppSelector } from "src/hook/redux/useStore";
import { authSelector } from "src/store/Auth";
import { userApi } from "src/api/user";
import { yupResolver } from "@hookform/resolvers/yup";

const Additional: React.FC = () => {
  const { userInfo } = useAppSelector(authSelector);

  const ChangePassWordSchema = yup.object().shape({
    current_password: yup.string().required(),
    new_password: yup
      .string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters")
      .test(
        "no-match",
        "New password must be different than old password",
        (value, { parent }) => value !== parent.current_password
      ),
    new_password_confirmation: yup
      .string()
      .oneOf([yup.ref("new_password")], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({ resolver: yupResolver(ChangePassWordSchema) });

  const onSubmit = async (data: FieldValues) => {
    try {
      await userApi.updatePassword(data);
      toast.success("Password updated successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
      // console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      reset({
        email: userInfo.email,
      });
    }
  }, [userInfo]);

  return (
    <div className='title-1'>
      <Input label='Email*' className='w-full' register={register("email")} disabled />
      <form onSubmit={handleSubmit(onSubmit)} className='pt-4'>
        <div className='flex flex-col gap-20 pt-20'>
          <Input
            label='Current Password'
            type='password'
            register={register("current_password")}
            suffix='Eye'
          />
          <Input
            label='New Password'
            type='password'
            register={register("new_password")}
            suffix='Eye'
          />
          <Input
            label='Confirm Password'
            type='password'
            register={register("new_password_confirmation")}
            suffix='Eye'
          />
          <Button
            type='submit'
            className='w-full'
            buttonClassName='pt-16'
            disabled={!isValid}
            isPending={isSubmitting}
            buttonStyle={isValid ? "primary" : "disabled"}
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Additional;
