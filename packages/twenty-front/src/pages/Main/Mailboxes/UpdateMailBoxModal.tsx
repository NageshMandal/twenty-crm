import React, { Fragment, ReactNode, useRef, useState } from "react";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

import useOutsideClick from "../../../hook/common/useOutsideClick";
import Icon from "src/components/base/Icon";
import { useForm, Controller, FieldValues } from "react-hook-form";
import Input from "src/components/base/Input";
import axios from "src/utils/functions/axios";
import Checkbox from "src/components/base/Checkbox";
import Button from "src/components/base/Button";
import { toast } from "react-toastify";

type ModalProps = {
  show: boolean;
  onClose?: Function;
  disabled?: boolean;
  className?: string;
  hideClose?: boolean;
  mailbox?: any;
  setMailboxesFetchAgain?: Function;
};

const UpdateMailBoxModal: React.FC<ModalProps> = ({
  show = false,
  onClose = () => {},
  disabled = false,
  className = "",
  hideClose = false,
  mailbox,
  setMailboxesFetchAgain,
}) => {
  // console.log("mailboc data submitted:", mailbox);
  const ref = useRef<HTMLInputElement | null>(null);

  useOutsideClick(ref, () => {
    if (!disabled) onClose();
  });

  const { register, handleSubmit, control, reset } = useForm();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (formData: FieldValues) => {
    setIsPending(true);
    // const jsonData = { ...mailbox };
    let jsonData = {};
    if (mailbox) {
      jsonData = {
        ...mailbox,
        send_status: mailbox.send_status || 1,
        sync_status: mailbox.sync_status || 1,
        email: formData.emailAddress,
        sender_name: formData.senderName,
        bcc_address: "",
        send_settings: {
          ...mailbox.send_settings,
          secure: formData.enableTLS,
          login: formData.usernameSmtp,
          password: formData.passwordSmtp,
          host: formData.serverSmtp,
          port: formData.portSmtp,
          send_delay: formData.send_delay,
        },
        sync_settings: {
          ...mailbox.sync_settings,
          secure: formData.enableTLS,
          login: formData.usernameImap,
          password: formData.passwordImap,
          host: formData.serverImap,
          port: formData.portImap,
        },
      };
      await axios(true)
        .put(`${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes/${mailbox.id}`, jsonData)
        .then((response) => {
          toast.success("MailBox Updated successfully");
          // console.log("MailBox Updated successfully", response.data);
          setMailboxesFetchAgain(true);
          onClose();
        })
        .catch((error) => {
          toast.error("Error Updating of MailBox " + error);
          // console.error("Error Updation of MailBox:", error);
        });
    } else {
      jsonData = {
        send_status: 1,
        sync_status: 1,
        email: formData.emailAddress,
        sender_name: formData.senderName,
        send_settings: {
          secure: formData.enableTLS,
          login: formData.usernameSmtp,
          password: formData.passwordSmtp,
          host: formData.serverSmtp,
          port: formData.portSmtp,
          send_delay: formData.send_delay,
        },
        sync_settings: {
          secure: formData.enableTLS,
          login: formData.usernameImap,
          password: formData.passwordImap,
          host: formData.serverImap,
          port: formData.portImap,
        },
      };
      await axios(true)
        .post(`${process.env.REACT_APP_PLAYBOOK_API_URL}/mailboxes`, jsonData)
        .then((response) => {
          toast.success("MailBox Added Successfully");
          // console.log("MailBox Updated successfully", response.data);
          setMailboxesFetchAgain(true);
          onClose();
        })
        .catch((error) => {
          toast.error("Error Adding of MailBox " + error);
          if (error && error.response.data && error.response.data.email) {
            toast.error(error.response.data.email[0] as any);
          }
          // console.error("Error Updation of MailBox:", error);
        });
    }

    // console.log("Form data submitted:", formData);
    // console.log("mailboc data submitted:", mailbox);
    // console.log("jsonData data submitted:", jsonData);
    setIsPending(false);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <div className=' relative z-50 dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-thin'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 overflow-hidden bg-black bg-opacity-25' />
          </Transition.Child>
          <div className='p-8 m-20 left-50 fixed inset-0 z-50 flex items-end justify-center py-20 overflow-hidden tablet:items-center'>
            <Transition.Child
              as={Fragment}
              enter={"ease-out duration-300"}
              enterFrom={"tablet:opacity-0 tablet:scale-95 translate-y-full tablet:translate-y-0"}
              enterTo={"opacity-100 scale-100 translate-y-0"}
              leave={"ease-in duration-200"}
              leaveFrom={"opacity-100 scale-100 translate-y-0"}
              leaveTo={"tablet:opacity-0 tablet:scale-95 translate-y-full tablet:translate-y-0"}
            >
              <div
                className='relative w-screen max-h-full pt-10 border bg-modalContentColor dark:bg-contentColor-dark dark:border-borderColor-dark rounded-t-2xl tablet:rounded-b-2xl tablet:w-auto scrollbar-thin dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-track-rounded-full'
                ref={ref}
                style={{ overflow: "auto" }}
              >
                {!hideClose && (
                  <div
                    className={"w-24 h-24 absolute top-20 right-20"}
                    onClick={() => {
                      if (!disabled) onClose();
                    }}
                    role='button'
                  >
                    <Icon name='Cross' className='dark:text-neutral-200 text-neutral-800' />
                  </div>
                )}
                <div
                  className={classNames(
                    "h-full tablet:p-20 p-15 px-80 w-500 py-20 my-20",
                    className
                  )}
                >
                  {/* {JSON.stringify(getErrorsList())}
                   */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='pt-8'>
                      <label className='dark:text-white pt-8'>Email address *</label>
                      <Input
                        type='text'
                        name='emailAddress'
                        register={register("emailAddress")}
                        defaultValue={mailbox?.email}
                        required
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div>
                    <div className='pt-8'>
                      <label className='dark:text-white pt-8'>Sender Name</label>
                      <Input
                        type='text'
                        name='senderName'
                        register={register("senderName")}
                        defaultValue={mailbox?.sender_name}
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div>
                    <div className='pt-20'>
                      <label className='dark:text-white text-20'>Incoming Mail (Imap)</label>
                    </div>
                    <div className='pt-8'>
                      <label className='dark:text-white pt-8'>Username *</label>
                      <Input
                        type='text'
                        name='usernameImap'
                        register={register("usernameImap")}
                        defaultValue={mailbox?.sync_settings.login}
                        required
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div>
                    <div className='pt-8'>
                      <label className='dark:text-white pt-8'>Password *</label>
                      <Input
                        type='password'
                        name='passwordImap'
                        register={register("passwordImap")}
                        defaultValue={mailbox?.sync_settings.password}
                        required
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div>
                    {/* <div>
                      <label className='dark:text-white pt-8'>Server *</label>
                      <Input
                        type='text'
                        name='serverImap'
                        register={register("serverImap")}
                        defaultValue={mailbox?.sync_settings.host}
                        required
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div>
                    <div>
                      <label className='dark:text-white pt-8'>Port *</label>
                      <Input
                        type='number'
                        name='portImap'
                        register={register("portImap")}
                        defaultValue={mailbox?.sync_settings.port}
                        required
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div> */}
                    <div className='flex justify-between pt-8'>
                      <div>
                        <label className='dark:text-white pt-8'>Server *</label>
                        <Input
                          type='text'
                          name='serverImap'
                          register={register("serverImap")}
                          defaultValue={mailbox?.sync_settings.host}
                          required
                          className='dark:bg-gray-999 dark:text-white'
                        />
                      </div>
                      <div>
                        <label className='dark:text-white pt-8'>Port *</label>
                        <Input
                          type='number'
                          name='portImap'
                          register={register("portImap")}
                          placeholder='993'
                          defaultValue={mailbox?.sync_settings.port}
                          required
                          className='dark:bg-gray-999 dark:text-white'
                        />
                      </div>
                    </div>

                    <div className='pt-20'>
                      <label className='dark:text-white text-20'>Outgoing Mail (SMTP)</label>
                    </div>
                    <div className='pt-8'>
                      <label className='dark:text-white pt-8'>Username *</label>
                      <Input
                        type='text'
                        name='usernameSmtp'
                        register={register("usernameSmtp")}
                        defaultValue={mailbox?.send_settings.login}
                        required
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div>
                    <div className='pt-8'>
                      <label className='dark:text-white pt-8'>Password *</label>
                      <Input
                        type='password'
                        name='passwordSmtp'
                        register={register("passwordSmtp")}
                        defaultValue={mailbox?.send_settings.password}
                        required
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div>
                    <div className='flex justify-between pt-8'>
                      <div>
                        <label className='dark:text-white pt-8'>Server *</label>
                        <Input
                          type='text'
                          name='serverSmtp'
                          register={register("serverSmtp")}
                          defaultValue={mailbox?.send_settings.host}
                          required
                          className='dark:bg-gray-999 dark:text-white'
                        />
                      </div>
                      <div className='pt-8'>
                        <label className='dark:text-white pt-8'>Port *</label>
                        <Input
                          type='text'
                          name='portSmtp'
                          placeholder='465'
                          register={register("portSmtp")}
                          defaultValue={mailbox?.send_settings.port}
                          required
                          className='dark:bg-gray-999 dark:text-white'
                        />
                      </div>
                    </div>
                    <div className='pt-8'>
                      <label className='dark:text-white pt-8 text-20'>
                        Delay Between Sending Mails
                      </label>
                    </div>
                    <div className='pt-8'>
                      <Input
                        type='number'
                        name='send_delay'
                        placeholder='6'
                        register={register("send_delay")}
                        defaultValue={mailbox?.send_settings.send_delay}
                        required
                        className='dark:bg-gray-999 dark:text-white'
                      />
                    </div>
                    <div className='pt-8'>
                      <label className='dark:text-white pt-8 text-20'>Server Security</label>
                    </div>
                    <div className='pt-8'>
                      {/* <Checkbox
                        control={control}
                        name='enableTLS'
                        className='dark:bg-gray-999 dark:text-white'
                        label='Enable TLS'
                        value={mailbox?.send_settings.secure && mailbox?.sync_settings.secure}
                        checked={mailbox?.send_settings.secure && mailbox?.sync_settings.secure}
                      /> */}
                      <Controller
                        name='enableTLS'
                        control={control}
                        defaultValue={
                          (mailbox?.send_settings.secure && mailbox?.sync_settings.secure) ?? true
                        } // setting default value
                        render={({ field: { onChange, value } }) => (
                          <Checkbox
                            className='dark:bg-gray-999 dark:text-white'
                            label='Enable TLS'
                            name='enableTLS'
                            control={control}
                            value={value}
                            checked={value}
                            onChange={onChange}
                          />
                        )}
                      />
                    </div>
                    <div className='flex justify-between pt-20'>
                      <Button
                        buttonStyle='error'
                        type='button'
                        onClick={handleCancel}
                        className='dark:bg-gray-999 dark:text-white'
                      >
                        Cancel
                      </Button>
                      <Button
                        isPending={isPending}
                        disabled={isPending}
                        buttonStyle='primary'
                        type='submit'
                        className='dark:bg-gray-999 dark:text-white'
                      >
                        {mailbox ? "Update" : "Add"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default UpdateMailBoxModal;
