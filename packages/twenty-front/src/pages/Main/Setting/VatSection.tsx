import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm, FieldValues } from "react-hook-form";

import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import { userApi } from "src/api/user";
import { useAppSelector } from "src/hook/redux/useStore";
import { authSelector } from "src/store/Auth";

const VatSection: React.FC = () => {
  const { userInfo } = useAppSelector(authSelector);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      await userApi.updateBilling(data);
      toast.success("Vat number changed successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to update VAT number. Please try again later.");
      // console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      setValue("vat_number", userInfo.billing.vat_number);
    }
  }, [userInfo]);

  return (
    <div className='title-1'>
      <form onSubmit={handleSubmit(onSubmit)} className='pt-4'>
        <div className='flex flex-col gap-20 pt-20'>
          <Input label='VAT Number' register={register("vat_number")} />
          <Button
            type='submit'
            className='w-full'
            buttonClassName='pt-16'
            isPending={isSubmitting}
            disabled={!isValid}
            buttonStyle={isValid ? "primary" : "disabled"}
          >
            Change Vat Number
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VatSection;
