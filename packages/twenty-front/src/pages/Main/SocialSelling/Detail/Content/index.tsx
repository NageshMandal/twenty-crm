import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import { IProspect } from "src/utils/types/social-selling";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { addCommentAll, handleSkipPost, socialSellingSelector } from "src/store/SocialSelling";
import Comments from "./Comments";
import Modal from "src/components/base/Modal";
import { authSelector } from "src/store/Auth";
import { IReqLead, IResAddAutomation } from "src/utils/types/leads";
import { leadApi } from "src/api/leads";

type Props = {
  socialSellingInfo: IProspect;
  wid: string;
  toAuto: any;
  toAutoId: any;
};

const SocialSellingContent: React.FC<Props> = ({ socialSellingInfo, wid, toAuto, toAutoId }) => {
  const dispatch = useAppDispatch();

  const { isAllCommentPending, commentedList, isSkipPending } =
    useAppSelector(socialSellingSelector);
  const { userInfo } = useAppSelector(authSelector);

  const [isLessShow, setIsLessShow] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isAddAutomationLoading, setIsAddAutomationLoading] = useState(false);

  const list = useMemo(() => {
    if (socialSellingInfo) {
      const result = socialSellingInfo.profile.recent_posts.filter(
        (postItem) =>
          !postItem.is_commented &&
          commentedList?.find((commentItem) => commentItem.post_id === postItem.id)
      );
      return result;
    }
  }, [socialSellingInfo, commentedList]);

  const handleCommentAll = async () => {
    const pid = socialSellingInfo.id;
    const res = await dispatch(addCommentAll({ wid, pid }));
    if (addCommentAll.fulfilled.match(res)) {
      setShowModal(false);
      toast.success("All comments successfully added!");
      setIsAddAutomationLoading(true);
      try {
        if (toAuto) {
          const req: IReqLead = {
            all: false,
            ids: socialSellingInfo ? [socialSellingInfo.prospect_id.toString()] : [],
            query: `@user_id in ${userInfo?.id}`,
            wid: toAutoId.id.toString(),
          };
          const res1 = (await leadApi.addAutomation(req)) as unknown as IResAddAutomation;
          if (res1?.added === 0) {
            toast.info(`This prospect is already added`);
          } else if (res1?.added && res1?.added !== 0) {
            toast.success(`Prospect successfully added`);
          }
        }
      } catch (error) {
        console.error("error: ", error);
      }
      setIsAddAutomationLoading(false);
    }
  };

  const handleSkip = async () => {
    const pid = socialSellingInfo.id;
    const res = await dispatch(handleSkipPost({ wid, pid }));
    if (handleSkipPost.fulfilled.match(res)) {
      toast.success("Skipped Successfully!");
    }
  };

  return (
    <>
      <div className='flex gap-20 pt-40 pb-20'>
        <div className='flex flex-col border rounded-md gap-25 p-13 w-1/3 h-fit text-neutral-800 dark:text-neutral-300 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark'>
          <div className='flex items-center justify-between w-full gap-10'>
            <div className='flex items-center gap-10'>
              <div className='flex-none overflow-hidden rounded-full w-50 h-50'>
                <img src={socialSellingInfo.profile.profile_image_url} />
              </div>
              <div className='text-neutral-800 dark:text-neutral-300'>
                <p className='font-bold text-14'>{socialSellingInfo.profile.fullname}</p>
                <p className='font-normal text-12'>
                  {socialSellingInfo.profile.title} of {socialSellingInfo.company_name}
                </p>
                <p className='font-normal text-12'>{socialSellingInfo.profile.location}</p>
              </div>
            </div>
            <div className='flex flex-col gap-10'>
              <Link to={socialSellingInfo.profile_url}>
                <Icon name='LinkedIn' className='w-18 h-18' />
              </Link>
              <Link to={socialSellingInfo.company_url}>
                <Icon name='Building' className='w-18 h-18 text-[#0966c2]' />
              </Link>
            </div>
          </div>

          <div className={`relative ${isLessShow ? "h-200 overflow-hidden" : "min-h-200"}`}>
            {list?.map((item, index) => (
              <div key={item.id} className='flex flex-col gap-4 pb-10'>
                <p className='font-bold text-14 text-neutral-700 dark:text-neutral-400'>
                  {index + 1}. {item.post_title}{" "}
                  {item.post_date && !isNaN(new Date(item.post_date).getTime()) ? (
                    <span className='font-medium cursor-default text-14 whitespace-nowrap text-primary'>
                      {`${formatDistanceToNow(new Date(item.post_date))} ago`}
                    </span>
                  ) : null}
                </p>
                <p className='font-normal text-14 text-neutral-800 dark:text-neutral-400'>
                  {item.post_description}
                </p>
              </div>
            ))}
          </div>
          <p
            onClick={() => setIsLessShow((prev) => !prev)}
            className='-mt-20 font-normal text-right cursor-pointer select-none text-16 text-primary'
          >
            {isLessShow ? "More" : "Less"}
          </p>

          <div className='flex items-center justify-end py-17 -mt-15'>
            <div className='flex items-center gap-10'>
              <Button
                isPending={isSkipPending}
                onClick={() => handleSkip()}
                className='w-90'
                prefix='Cross'
                buttonStyle='white'
              >
                Skip
              </Button>
            </div>
          </div>
        </div>
        <div className='flex flex-col border rounded-md p-13 w-2/3 h-fit border-borderColor dark:border-borderColor-dark bg-contentColor dark:bg-contentColor-dark text-neutral-800 dark:text-neutral-300'>
          <div className='flex flex-row items-end justify-between py-12'>
            <p className='px-8 font-medium text-20 text-neutral-800 dark:text-neutral-300'>
              Comment Post
            </p>
            <Button className='w-130' buttonStyle='secondary' onClick={() => setShowModal(true)}>
              Comment All
            </Button>
          </div>
          {list?.map((item, index) => (
            <Comments
              key={item.id}
              post={item}
              postIndex={index}
              wid={wid}
              pid={socialSellingInfo?.id}
              toAuto={toAuto}
              toAutoId={toAutoId}
              prospectId={socialSellingInfo?.prospect_id}
            />
          ))}
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className='flex flex-col gap-10 pb-30 pt-35 w-500'>
          <h2 className='font-normal text-center dark:text-neutral-200 text-neutral-800 text-24'>
            Are you sure to send All Comments for all Posts of This Prospect ?
          </h2>
          <div className='flex justify-center gap-20 pt-30 '>
            <Button
              buttonStyle='primary'
              onClick={(event) => {
                event.stopPropagation();
                handleCommentAll();
              }}
              isPending={isAllCommentPending}
              type='submit'
              buttonClassName='flex justify-end'
            >
              Comment All
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              buttonClassName='flex justify-end'
              buttonStyle='secondary'
              className='w-120'
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SocialSellingContent;
