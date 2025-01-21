import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm, Controller, FieldValues } from "react-hook-form";

import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import ReactAvatar from "src/components/modules/Avatar";
import { useAppSelector } from "src/hook/redux/useStore";
import { authSelector } from "src/store/Auth";
import { countries } from "src/utils/constants/country";
import { ISelectOption } from "src/utils/types";
import ReactSelect from "src/components/base/ReactSelect";
import { userApi } from "src/api/user";

const Account: React.FC = () => {
  const { userInfo } = useAppSelector(authSelector);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const CountryOptions = countries?.map((item) => ({
    label: item.name,
    value: item.code?.toLowerCase(),
  }));

  const onSubmit = async (data: FieldValues) => {
    try {
      await userApi.updateUser(data);
      toast.success("Account info updated successfully!");
    } catch (error) {
      // console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      reset({
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        telephone: userInfo.phone,
        company: userInfo.company,
        job_title: userInfo.job_title,
        country: userInfo?.country,
      });
    }
  }, [userInfo]);

  return (
    <div className='title-1'>
      <div className='flex items-center gap-10'>
        <ReactAvatar
          className='rounded-full'
          name={userInfo?.full_name?.replace(/^(\w)\w*\s(\w)\w*.*$/, "$1 $2")}
          size='70'
          color={userInfo?.color}
          src={userInfo?.avatar ?? ""}
        />
        <div className='flex flex-col justify-center'>
          <p className='text-20'>
            {userInfo?.sub_manager ? userInfo?.sub_manager?.first_name : userInfo?.first_name}{" "}
            {userInfo?.sub_manager ? userInfo?.sub_manager?.last_name : userInfo?.last_name}
          </p>
          <p className='text-16'>{userInfo?.company?.toUpperCase()}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-20 pt-20'>
          <Input label='First Name*' register={register("first_name")} />
          <Input label='Last Name *' register={register("first_name")} />
          <Input label='Telephone' register={register("telephone")} />
          <Input label='Company' register={register("company")} />
          <Input label='Job title' register={register("job_title")} />
          <div className='flex flex-col'>
            <p className='block px-5 mb-4 font-normal text-neutral-800 dark:text-neutral-200 text-14'>
              Country
            </p>
            <Controller
              name='country'
              control={control}
              render={({ field: { value, onChange } }) => (
                <ReactSelect
                  options={CountryOptions ?? []}
                  value={CountryOptions?.find((option: ISelectOption) => option.value === value)}
                  onChange={(option: ISelectOption) => {
                    if (option) {
                      onChange(option?.value);
                    }
                  }}
                />
              )}
            />
          </div>
          <Button type='submit' className='w-full' buttonClassName='pt-16' isPending={isSubmitting}>
            Update Account
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Account;
