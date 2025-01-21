import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
// import EmojiPicker from "emoji-picker-react";
// import ReactQuill from "react-quill";
import { ClipLoader } from "react-spinners";
import "react-quill/dist/quill.snow.css";

import Button from "src/components/base/Button";
// import Icon from "src/components/base/Icon";
// import PopoverButton from "src/components/base/PopoverButton";
import useDebounce from "src/hook/common/useDebounce";
import { IOrganizationPrompts, IPost } from "src/utils/types/social-selling";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import {
  addOneComment,
  editCommentByAi,
  editCommentByLang,
  getAskAiPrompts,
  getCommentedMessage,
  getSSLangs,
  skipSinglePost,
  socialSellingSelector,
  updateComment,
} from "src/store/SocialSelling";
import GroupSelect from "src/components/base/GroupSelect";
import Tooltip from "src/components/base/Tooltip";
import { IGroupSelectMenu } from "src/utils/types";
import Textarea from "src/components/base/Textarea";
import ReactSelect from "src/components/base/ReactSelect";
import { IReqLead, IResAddAutomation } from "src/utils/types/leads";
import { leadApi } from "src/api/leads";
import { authSelector } from "src/store/Auth";

type Props = {
  post?: Partial<IPost>;
  wid: string;
  pid: number;
  postIndex: number;
  toAuto: any;
  toAutoId: any;
  prospectId: number;
};

const emojiList = [
  {
    value: "🤓",
    help: "Casual",
    id: 3,
  },
  {
    value: "👏",
    help: "Congratulate",
    id: 4,
  },
  {
    value: "🙏",
    help: "Appreciation",
    id: 5,
  },
];

const Comments: React.FC<Props> = ({ post, wid, pid, postIndex, toAuto, toAutoId, prospectId }) => {
  const dispatch = useAppDispatch();
  // const editRef = useRef<any>();

  const [valueQuill, setValueQuill] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const comment = useDebounce(valueQuill, 2000);

  const [isManualChange, setIsManualChange] = useState(false);

  const [isAiPending, setAiPending] = useState(false);
  const [selectedLang, setSelectedLang] = useState("Select Language");
  const [isAiLangPending, setAiLangPending] = useState(false);
  const [isAddAutomationLoading, setIsAddAutomationLoading] = useState(false);

  // const [isSkipPending, setSkipPending] = useState(false);

  const {
    isOneCommentPending,
    commentedList,
    isUpdateCommentPending,
    askAiPrompts,
    ssLangs,
    isSkipPending,
  } = useAppSelector(socialSellingSelector);

  const { userInfo } = useAppSelector(authSelector);

  const getAskAiPrompt = async () => {
    if (askAiPrompts) {
      return;
    }
    await dispatch(getAskAiPrompts(wid));
  };

  const getSSLangsList = async () => {
    if (ssLangs) {
      return;
    }
    await dispatch(getSSLangs("0"));
  };

  const prompts = useMemo(() => {
    const organizedPrompts: IOrganizationPrompts = {};

    if (askAiPrompts) {
      askAiPrompts?.forEach((prompt) => {
        const menuName = prompt.menu;

        if (!organizedPrompts[menuName]) {
          organizedPrompts[menuName] = [];
        }

        organizedPrompts[menuName].push(prompt);
      });
    }

    const result = Object.entries(organizedPrompts)?.map(([groupName, options]) => ({
      groupName,
      options,
    }));

    return result as unknown as IGroupSelectMenu[];
  }, [askAiPrompts]);

  const [originComment, setOriginComment] = useState("");

  // const handleButtonClick = (symbol: string) => {
  //   if (editRef?.current) {
  //     const quill = editRef?.current?.getEditor();
  //     const selection = quill?.getSelection();

  //     if (selection) {
  //       quill.insertText(selection.index, symbol);
  //       quill.setSelection(selection.index + symbol.length);
  //     } else {
  //       quill.setText(`${quill.getText()}${symbol}`);
  //       quill.setSelection(quill.getLength());
  //     }
  //     setValueQuill(quill.getContents());
  //   }
  // };

  const handleAddComment = async () => {
    if (post) {
      const cid = commentedList?.find((item) => item.post_id === post.id)?.comment_id as number;
      const sid = post.step_id as number;
      const postId = post.id;
      const res = await dispatch(
        addOneComment({ wid, pid, sid, cid, message: valueQuill, postId })
      );
      if (addOneComment.fulfilled.match(res)) {
        setValueQuill("");
        toast.success("Commented successfully!");
        setIsAddAutomationLoading(true);
        try {
          if (toAuto) {
            const req: IReqLead = {
              all: false,
              ids: prospectId ? [prospectId.toString()] : [],
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
    }
    // console.log("autoid " + toAuto + " toautoid " + toAutoId.id);
  };

  const handleUpdateComment = async () => {
    if (post) {
      const cid = commentedList?.find((item) => item.post_id === post.id)?.comment_id as number;
      const sid = post.step_id as number;
      const postId = post.id;
      const res = await dispatch(updateComment({ wid, pid, sid, cid, message: comment, postId }));
      if (updateComment.fulfilled.match(res)) {
        toast.success("Comment successfully Updated!");
      }
    }
  };

  const handleUpdateAi = async (promptId: number) => {
    if (isAiPending || isAiLangPending) {
      toast.warn("AI is already in progress for you request please try again in a minute.");
    } else {
      setAiPending(true);
      if (post) {
        const cid = commentedList?.find((item) => item.post_id === post.id)?.comment_id as number;
        const sid = post.step_id as number;
        const postId = post.id;
        const res = await dispatch(
          editCommentByAi({ wid, pid, sid, cid, message: comment, postId, promptId })
        );
        if (editCommentByAi.fulfilled.match(res)) {
          await dispatch(getCommentedMessage(wid));
        }
        toast.success("Message successfully Updated by AI!");
      }
      setAiPending(false);
    }
  };

  const handleUpdateLang = async (langId: number) => {
    if (isAiLangPending || isAiPending) {
      toast.warn("AI is already in progress for you request please try again in a minute.");
    } else {
      setAiPending(true);
      setAiLangPending(true);
      if (post) {
        const cid = commentedList?.find((item) => item.post_id === post.id)?.comment_id as number;
        const sid = post.step_id as number;
        const postId = post.id;
        const res = await dispatch(
          editCommentByLang({ wid, pid, sid, cid, message: comment, postId, langId })
        );
        if (editCommentByLang.fulfilled.match(res)) {
          await dispatch(getCommentedMessage(wid));
        }
        toast.success("Comment successfully Updated by AI!");
      }
      setAiPending(false);
      setAiLangPending(false);
    }
  };

  useEffect(() => {
    const message = commentedList
      ?.find((commentItem) => commentItem.post_id === post?.id)
      ?.message?.split(`<p>`)
      ?.at(-1) as string;
    setValueQuill(message);
    setOriginComment(message);
    // setValueQuill("<p>" + message);
    // setOriginComment("<p>" + message);
  }, [post, commentedList]);

  useEffect(() => {
    if (comment.length > 0 && comment !== originComment && isManualChange) {
      handleUpdateComment();
    }
  }, [comment]);

  useEffect(() => {
    getAskAiPrompt();
    getSSLangsList();
  }, []);

  const onLangChange = async (val: any) => {
    setSelectedLang(val.label);
    handleUpdateLang(val.value);
  };

  const handleSkipSinglePost = async (postId: any) => {
    if (!isSkipPending) {
      // setSkipPending(true);
      const res = await dispatch(skipSinglePost({ pid, postId }));
      if (skipSinglePost.fulfilled.match(res)) {
        toast.success("Skipped Successfully!");
      }

      // setSkipPending(false);
    }
  };

  return (
    <div className='pb-10'>
      <div className='flex items-center px-3 pb-4'>
        <p className='font-medium text-gray-800 text-14 dark:text-neutral-200'>Post title:</p>
        <p className='flex-1 w-full overflow-hidden font-bold text-gray-700 truncate text-14 dark:text-neutral-200'>
          {postIndex + 1}. {post?.post_title}
        </p>
      </div>
      {/* <ReactQuill
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        ref={editRef}
        theme='snow'
        value={valueQuill}
        onChange={(val) => {
          if (isUpdateCommentPending || isAiPending) {
            return;
          } else {
            if (isFocus) {
              setValueQuill(val);
              setIsManualChange(true);
            }
          }
        }}
        className={`react-quill ${isFocus ? "quill-focus" : ""}`}
      /> */}
      <Textarea
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={valueQuill}
        onChange={(event) => {
          if (isUpdateCommentPending || isAiPending) {
            return;
          } else {
            if (isFocus) {
              setValueQuill(event?.target?.value);
              setIsManualChange(true);
            }
          }
        }}
        className='h-200'
      />

      <div
        className={`flex items-start pt-10 pl-0  ${
          isUpdateCommentPending || isAiPending ? "justify-between" : "justify-end"
        }`}
      >
        {isUpdateCommentPending && (
          <div className='flex items-center gap-4'>
            <p className='text-14 text-neutral-800 dark:text-neutral-300'>Updating...</p>
            <ClipLoader color='#2285E1' size={18} />
          </div>
        )}
        {isAiPending && (
          <div className='flex items-center gap-4'>
            <p className='text-14 text-neutral-800 dark:text-neutral-300'>Updating by AI...</p>
            <ClipLoader color='#2285E1' size={18} />
          </div>
        )}
        <div className='relative flex items-center gap-6 pb-25'>
          {/* <GroupSelect
            list={prompts}
            onChange={handleUpdateAi}
            originList={askAiPrompts}
            defaultValue='Translate To'
          /> */}
          <span>AI Translation:</span>
          <ReactSelect
            label=''
            placeholder={selectedLang}
            options={
              ssLangs
                ? Array.from(ssLangs).map((item: any) => ({ label: item.lang, value: item.id }))
                : []
            }
            value={selectedLang}
            onChange={(val: any) => {
              // console.log("val c: " + JSON.stringify(val));
              onLangChange(val);
            }}
          ></ReactSelect>
          <GroupSelect
            list={prompts}
            onChange={handleUpdateAi}
            originList={askAiPrompts}
            defaultValue='Ask AI'
          />
          {emojiList.map((item) => (
            <div
              key={item.value}
              onClick={() => handleUpdateAi(item.id)}
              className='flex items-center justify-center cursor-pointer select-none w-30 h-30'
            >
              <Tooltip label={item.help} center>
                <p className='text-center transition-all duration-100 text-16 hover:text-18 w-18'>
                  {item.value}
                </p>
              </Tooltip>
            </div>
          ))}
          {/* <div className='flex justify-end p-13'>
            <PopoverButton
              className='p-0 top-25'
              button={
                <Tooltip center label='Find another reaction'>
                  <Icon
                    name='Emoji'
                    className='flex-none w-18 h-18 text-warning-2 dark:text-warning-1'
                  />
                </Tooltip>
              }
            >
              <EmojiPicker
                onEmojiClick={(event) => {
                  handleButtonClick(event.emoji);
                  setIsManualChange(true);
                }}
                height={350}
                searchDisabled
                previewConfig={{ showPreview: false }}
              />
            </PopoverButton>
          </div> */}
          <Button
            isPending={isSkipPending}
            onClick={() => handleSkipSinglePost(post.id)}
            className='w-90'
            prefix='Cross'
            buttonStyle='white'
          >
            Skip
          </Button>
          <Button
            isPending={isOneCommentPending || isUpdateCommentPending}
            onClick={() => handleAddComment()}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
