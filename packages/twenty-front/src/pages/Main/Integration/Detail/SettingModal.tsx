import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Controller, FieldValues, useForm } from "react-hook-form";

import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import Modal from "src/components/base/Modal";
import ReactLoading from "react-loading";
import ReactSelect from "src/components/base/ReactSelect";
import Switch from "src/components/base/Switch";
import { IIntegration, IIntegrationSetting, IResUpdateSetting } from "src/utils/types/integration";
import { ISelectOption } from "src/utils/types";
import { integrationApi } from "src/api/integration";

type Props = {
  open: boolean;
  onClose: Function;
  isSettingLoading: boolean;
  integration: IIntegration;
  settingInfo?: IIntegrationSetting[];
  handleGetIntegrationSetting: Function;
};

const SettingModal: React.FC<Props> = ({
  open,
  onClose,
  isSettingLoading,
  integration,
  settingInfo,
  handleGetIntegrationSetting,
}) => {
  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = (await integrationApi.updateIntegrationSettings(
        integration?.slug,
        data
      )) as unknown as IResUpdateSetting;
      handleGetIntegrationSetting();
      toast.success(res?.message);
    } catch (error) {
      // console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (settingInfo?.length) {
      settingInfo?.forEach((item) => {
        setValue(item.name, item.checked);
      });
    }
  }, [settingInfo]);

  return (
    <Modal show={open} onClose={() => onClose(false)}>
      {isSettingLoading || !integration ? (
        <div className='flex items-center justify-center h-150 w-550'>
          <ReactLoading className='mt-25' type={"spin"} color='#2285E1' width={40} />
        </div>
      ) : (
        <div className='pt-16 pb-6 w-550'>
          <h2 className='pb-20 font-normal text-center text-20 dark:text-neutral-200 text-neutral-800'>
            {`${integration?.name} Setting`}
          </h2>
          {!!settingInfo?.length ? (
            <form className='py-10' onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-16 px-20 max-h-500 overflow-auto scrollbar-1'>
                {settingInfo?.map((item) => {
                  switch (item.type) {
                    case "text":
                      return (
                        <div key={item?.name} className='flex flex-col gap-4'>
                          <Input
                            label={item?.label}
                            register={register(item?.name ?? "")}
                            error={item.required ? errors[item.name] : undefined}
                            type={item?.type ?? "text"}
                          />
                          {item?.hint && (
                            <p className='title-2 text-12 px-2 pt-2'>{item?.hint ?? ""}</p>
                          )}
                        </div>
                      );
                    case "select":
                      let selectOptions: ISelectOption[];
                      if (item.options.length !== 0) {
                        selectOptions = Object.keys(item?.options)?.map((key) => ({
                          label: key,
                          value: key,
                        }));
                      }
                      return (
                        <div className='py-0' key={item?.name}>
                          <p className='block px-5 mb-4 font-normal text-neutral-800 dark:text-neutral-200 text-14'>
                            {item?.label}
                          </p>
                          <Controller
                            name={item?.name}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <ReactSelect
                                options={selectOptions ?? []}
                                value={selectOptions?.find(
                                  (option: ISelectOption) => option.value === value
                                )}
                                onChange={(option: ISelectOption) => {
                                  if (option) {
                                    onChange(option?.value);
                                  }
                                }}
                              />
                            )}
                          />
                          <p className='title-2 text-12 px-2 pt-2'>{item?.hint}</p>
                        </div>
                      );
                    case "checkbox":
                      return (
                        <div key={item?.name}>
                          <Switch
                            control={control}
                            disabled={item.disabled}
                            name={item?.name}
                            suffixLabel={item?.label}
                          />
                          <p className='title-2 text-12 px-2 pt-2'>{item?.hint}</p>
                        </div>
                      );
                    default:
                  }
                })}
              </div>
              <div className='flex justify-center gap-16 pt-20'>
                <Button type='submit' isPending={isSubmitting} className='w-80'>
                  Update
                </Button>
                <Button buttonStyle='secondary' onClick={() => onClose(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : null}
        </div>
      )}
    </Modal>
  );
};

export default SettingModal;
