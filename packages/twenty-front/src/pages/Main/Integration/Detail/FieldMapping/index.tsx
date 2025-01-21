import React, { useEffect, useMemo, useState } from "react";
import ReactLoading from "react-loading";
import { GoTrash } from "react-icons/go";
import { toast } from "react-toastify";
import { FieldValues, useForm, useWatch } from "react-hook-form";

import Button from "src/components/base/Button";
import FieldItem from "./FieldItem";
import Icon from "src/components/base/Icon";
import Modal from "src/components/base/Modal";
import ReactSelect from "src/components/base/ReactSelect";
import ReactSelectRh from "src/components/base/ReactSelectRh";
import { IIntegrationFields, IResFields } from "src/utils/types/integration";
import { ISelectOption } from "src/utils/types";
import { integrationApi } from "src/api/integration";

type Props = {
  slug: string;
  name: string;
};

const contactOptions = [
  { label: "Company", value: "Account" },
  { label: "Contact", value: "Contact" },
  { label: "Lead", value: "Lead" },
];

const FieldMapping: React.FC<Props> = ({ slug, name }) => {
  const [variant, setVariant] = useState<"Account" | "Contact" | "Lead">("Account");
  const [fields, setFields] = useState<IIntegrationFields>();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteState, setDeleteState] = useState({
    isLoading: false,
    hash: "",
  });

  const saleOptions = useMemo(() => {
    if (fields) {
      const result = fields[variant]?.selection?.st_fields;
      if (result) {
        const sales = Object.entries(result)?.map(([key, value]) => ({ value: key, label: value }));
        return sales;
      }
    }
  }, [variant, fields]);

  const crmOptions = useMemo(() => {
    if (fields) {
      const result = fields[variant]?.selection?.crm_fields;
      if (result) {
        const crm = Object.entries(result)?.map(([key, value]) => ({ value: key, label: value }));
        return crm;
      }
    }
  }, [variant, fields]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const [showModal, setShowModal] = useState(false);

  const salesField = useWatch({ control, name: "st_field_name" });
  const crmField = useWatch({ control, name: "crm_field_hash" });

  const isMapDisabled = useMemo(() => {
    return !crmField || !salesField;
  }, [salesField, crmField]);

  const handleGetFields = async () => {
    try {
      const res = (await integrationApi.getIntegrationFields(slug)) as unknown as IResFields;
      setFields(res?.fields);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const initialGetFields = async () => {
    setIsLoading(true);
    try {
      await handleGetFields();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleUnMap = async (hash: string) => {
    setDeleteState({
      isLoading: true,
      hash,
    });
    try {
      await integrationApi.integrationUnMap(slug, hash);
      await handleGetFields();
      toast.success("Field unmapped successfully!");
    } catch (error) {
      console.error("error: ", error);
    }
    setDeleteState({
      isLoading: true,
      hash,
    });
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      await integrationApi.integrationMap(
        slug,
        data?.crm_field_hash ?? "",
        data?.st_field_name ?? ""
      );
      await handleGetFields();
      setShowModal(false);
      toast.success("Field mapped successfully!");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (slug) {
      initialGetFields();
    }
  }, [slug]);

  return (
    <>
      <div className='py-6 border divide-y rounded-xl border-neutral-300 divide-neutral-300 dark:border-borderColor-dark dark:divide-borderColor-dark'>
        <div className='flex gap-10 px-16 pt-10 pb-15 text-neutral-800 dark:text-neutral-300'>
          <Icon name='BarBox' className='w-24 h-24 mt-6' />
          <div className=''>
            <div>
              <p className='text-14'>Field mapping</p>
            </div>
            <p className='text-13'>Match Demand’s data fields to HubSpot data fields.</p>
          </div>
        </div>
        <div className='flex flex-col gap-12 py-16 pr-100'>
          <div className='grid grid-cols-12 gap-20 px-16'>
            <div className='col-span-5'>
              <ReactSelect
                label='Select Contact Status'
                options={contactOptions}
                onChange={(option: ISelectOption) => setVariant(option?.value)}
                value={contactOptions?.find((item) => item.value === variant) ?? []}
              />
            </div>
            <div className='col-span-1'></div>
            <div className='text-15 flex items-center col-span-5 pt-20 text-center text-neutral-800 dark:text-neutral-300'>
              Select the status for contacts synced to HubSpot.
            </div>
          </div>
          <div className='grid grid-cols-12 px-16'>
            <p className='flex items-center justify-center col-span-5 text-neutral-800 dark:text-neutral-300'>
              {`Saleshub Field`}
            </p>
            <p className='flex items-center justify-center col-span-7 text-center text-neutral-800 dark:text-neutral-300'>
              {`${name} Field`}
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            {isLoading ? (
              <div className='flex items-center justify-center h-80 pr-70'>
                <ReactLoading className='mt-20' type={"spin"} color='#2285E1' width={40} />
              </div>
            ) : fields && fields[variant]?.mapping?.length > 0 ? (
              fields[variant]?.mapping?.map((item) => (
                <div className='grid grid-cols-12 gap-20 px-16 pb-10'>
                  <FieldItem label={item?.st_label} />
                  <div className='flex items-center justify-center col-span-1'>
                    <Icon
                      name='Exchange'
                      className='w-24 h-24 text-neutral-800 dark:text-neutral-300'
                    />
                  </div>
                  <FieldItem label={item?.crm_label} />
                  <div className='flex items-center justify-center col-span-1 '>
                    {deleteState.hash && deleteState.hash === item?.crm_hash ? (
                      <ReactLoading
                        className='m-0 p-0 !h-24'
                        type={"spin"}
                        color='#2285E1'
                        width={24}
                      />
                    ) : (
                      <GoTrash
                        onClick={() => handleUnMap(item?.crm_hash)}
                        id='delete'
                        className='w-22 h-22 title-2 hover:title-1 cursor-pointer'
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='flex justify-center pr-70 py-28 title-2 font-semibold'>
                No mapped fields
              </div>
            )}
          </div>
          <Button
            prefix='RingPlus'
            buttonStyle='secondary'
            buttonClassName='px-26'
            onClick={() => {
              setShowModal(true);
              setValue("st_field_name", undefined);
              setValue("crm_field_hash", undefined);
            }}
          >
            Add Field
          </Button>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className='w-550'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className='title-1 text-20 py-20 justify-center flex'>Select Filed to Map</h2>
            <div className='flex flex-col gap-20'>
              <ReactSelectRh
                label='Saleshub field'
                control={control}
                name='st_field_name'
                smallMenu
                options={saleOptions ?? []}
              />
              <ReactSelectRh
                label={`${name} field`}
                control={control}
                name='crm_field_hash'
                smallMenu
                top
                options={crmOptions ?? []}
              />
            </div>
            <div>
              <div className='flex justify-center gap-16 pt-30 pb-20'>
                <Button
                  type='submit'
                  isPending={isSubmitting}
                  className='w-90'
                  disabled={isMapDisabled}
                >
                  Map Field
                </Button>
                <Button buttonStyle='secondary' onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default FieldMapping;
