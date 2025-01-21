import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Icon from "src/components/base/Icon";
import Button from "src/components/base/Button";
import { IProspect } from "src/utils/types/social-selling";
import userAvatar from "src/assets/images/user.jpg";
import { useAppDispatch } from "src/hook/redux/useStore";
import { handleSendProspect, handleSkipPost } from "src/store/Personalization";
import EditPanel from "./EditPanel";

type Props = {
  prospect: IProspect;
  wid: string;
};

const ManualPostContent: React.FC<Props> = ({ prospect, wid }) => {
  const dispatch = useAppDispatch();

  const [isAllStep1, setIsAllStep1] = useState(false);
  const [isLessShow, setIsLessShow] = useState(true);

  const [isSkipPending, setIsSkipPending] = useState(false);
  const [isSendPending, setIsSendPending] = useState(false);

  const handleSkip = async () => {
    setIsSkipPending(true);
    const pid = prospect.id;
    const res = await dispatch(handleSkipPost({ wid, pid }));
    if (handleSkipPost.fulfilled.match(res)) {
      toast.success("Prospect is skipped Successfully!");
    }
    setIsSkipPending(false);
  };

  const handleSend = async () => {
    setIsSendPending(true);
    const pid = prospect.id;
    const res = await dispatch(handleSendProspect({ wid, pid }));
    if (handleSendProspect.fulfilled.match(res)) {
      toast.success("Prospect is sended Successfully!");
    }
    setIsSendPending(false);
  };

  return (
    <div className='flex gap-20 pt-40 pb-20'>
      <div className='flex flex-col border rounded-md lex gap-25 p-13 w-1/3 h-fit text-neutral-800 dark:text-neutral-300 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark'>
        <div className='flex items-center justify-between w-full gap-10'>
          <div className='flex items-center gap-10'>
            <div className='flex-none overflow-hidden rounded-full w-50 h-50'>
              <img
                src={
                  prospect.profile.profile_image_url
                    ? prospect.profile.profile_image_url
                    : userAvatar
                }
                alt='avatar'
              />
            </div>
            <div className='text-neutral-800 dark:text-neutral-300'>
              <p className='font-bold text-14'>{prospect.profile?.fullname}</p>
              <p className='font-normal text-12'>
                {prospect.profile.title} of {prospect.company_name}
              </p>
              <p className='font-normal text-12'>{prospect.profile.location}</p>
            </div>
          </div>
          <div className='flex flex-col gap-10'>
            <Link to={prospect.profile_url}>
              <Icon name='LinkedIn' className='w-18 h-18' />
            </Link>
            <Link to={prospect.company_url}>
              <Icon name='Building' className='w-18 h-18 text-[#0966c2]' />
            </Link>
          </div>
        </div>
        {prospect?.profile?.about ? (
          <div>
            <p className='font-normal text-14 text-neutral-800 dark:text-neutral-400'>
              About:
              <br />
              {prospect?.profile?.about}
            </p>
          </div>
        ) : null}
        {prospect?.profile?.recent_posts?.length ? (
          <div className={`relative ${isLessShow ? "h-250 overflow-hidden" : "min-h-300"}`}>
            {prospect?.profile?.recent_posts?.map((item, index) => (
              <div key={item.id} className='flex flex-col gap-4 pb-10'>
                <p className='font-bold text-14 text-neutral-700 dark:text-neutral-400'>
                  {index + 1}. {item.title}{" "}
                </p>
                <p className='font-normal text-14 text-neutral-800 dark:text-neutral-400'>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {prospect?.profile?.recent_posts?.length ? (
          <p
            onClick={() => {
              setIsLessShow((prev) => !prev);
            }}
            className='font-normal text-right cursor-pointer select-none text-16 text-primary'
          >
            {isLessShow ? "More" : "Less"}
          </p>
        ) : null}

        <div className='flex items-center justify-end pt-16 pb-8'>
          <div className='flex gap-6'>
            <Button
              prefix='Cross'
              isPending={isSkipPending}
              buttonStyle='white'
              onClick={() => handleSkip()}
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
      <div className='flex flex-col py-6 border rounded-md w-2/3 h-fit border-borderColor dark:border-borderColor-dark gap-25 px-13 h-fit bg-contentColor dark:bg-contentColor-dark'>
        <div className='flex flex-col pt-10 transition-all duration-300'>
          {(!isAllStep1 ? prospect?.messages.slice(0, 1) : prospect?.messages).map((message) => (
            <div key={message?.step_id}>
              <p className='font-bold text-14 text-neutral-700 dark:text-neutral-400'>
                {message?.name}
              </p>
              <EditPanel message={message} wid={wid} pid={prospect.id} />
            </div>
          ))}
        </div>
        <div className='flex items-center justify-end pt-40 py-17 -mt-15'>
          <div className='flex gap-10'>
            {prospect?.messages?.length > 1 ? (
              <Button
                onClick={() => setIsAllStep1((prev) => !prev)}
                suffix={isAllStep1 ? "ChevronUp" : "ChevronDown"}
                buttonStyle='secondary'
              >
                {isAllStep1 ? "Hide steps" : "See all steps"}
              </Button>
            ) : null}
            <Button isPending={isSendPending} onClick={() => handleSend()}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualPostContent;
