import React, { useEffect, useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
// import EmojiPicker from "emoji-picker-react";
// import ReactQuill from "react-quill";
import { toast } from "react-toastify";

import GroupSelect from "src/components/base/GroupSelect";
// import Icon from "src/components/base/Icon";
// import PopoverButton from "src/components/base/PopoverButton";
import Tooltip from "src/components/base/Tooltip";
import useDebounce from "src/hook/common/useDebounce";
import { IGroupSelectMenu } from "src/utils/types";
import { IMessage } from "src/utils/types/personalization";
import { IOrganizationPrompts } from "src/utils/types/social-selling";
import { socialSellingSelector } from "src/store/SocialSelling";
import { useAppSelector, useAppDispatch } from "src/hook/redux/useStore";
import { editMessageByAi, updateMessage } from "src/store/Personalization";
import { ClipLoader } from "react-spinners";
import Textarea from "src/components/base/Textarea";

type Props = {
  message: IMessage;
  wid: string;
  pid: number;
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

const EditPanel: React.FC<Props> = ({ message, wid, pid }) => {
  // const editRef = useRef<any>();
  const dispatch = useAppDispatch();

  const [isFocus, setIsFocus] = useState(false);
  const [isManualChange, setIsManualChange] = useState(false);
  const { askAiPrompts } = useAppSelector(socialSellingSelector);
  const [inputValue, setInputValue] = useState<string>(message?.message);

  const [originMessage, setOriginMessage] = useState<string>(message?.message);
  const updatedMessage = useDebounce(inputValue, 2000);

  const [isAskAiPending, setIsAskAiPending] = useState(false);
  const [isMessagePending, setIsMessagePending] = useState(false);

  const handleUpdateAi = async (promptId: number) => {
    setIsAskAiPending(true);
    const req = {
      wid,
      pid,
      sid: message.step_id,
      message: updatedMessage,
      mid: 0,
      promptId,
    };

    const res = await dispatch(editMessageByAi(req));
    if (editMessageByAi.fulfilled.match(res)) {
      setInputValue(res.payload.message);
      setOriginMessage(res.payload.message);
      toast.success("Message successfully Updated by AI!");
    }
    setIsAskAiPending(false);
  };

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
  //     setInputValue(quill.getContents());
  //   }
  // };

  const handleUpdateMessage = async () => {
    setIsMessagePending(true);
    const req = {
      wid,
      pid,
      sid: message.step_id,
      message: updatedMessage,
    };
    const res = await dispatch(updateMessage(req));
    if (updateMessage.fulfilled.match(res)) {
      toast.success("Message successfully Updated!");
      setOriginMessage(updatedMessage);
    }
    setIsManualChange(false);
    setIsMessagePending(false);
  };

  useEffect(() => {
    if (updatedMessage?.length > 0 && isManualChange && originMessage !== updatedMessage) {
      handleUpdateMessage();
    }
  }, [updatedMessage]);

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

  return (
    <div className='flex flex-col gap-20 mt-10'>
      {/* <ReactQuill
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        theme='snow'
        ref={editRef}
        value={inputValue}
        onChange={(val) => {
          if (isAskAiPending || isMessagePending) {
            return;
          } else {
            if (isFocus) {
              setInputValue(val);
              setIsManualChange(true);
            }
          }
        }}
        className={`react-quill ${isFocus ? "quill-focus" : ""}`}
      /> */}
      <Textarea
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={inputValue}
        onChange={(event) => {
          if (isAskAiPending || isMessagePending) {
            return;
          } else {
            if (isFocus) {
              setInputValue(event?.target?.value);
              setIsManualChange(true);
            }
          }
        }}
        className='h-200'
      />
      <div
        className={`flex items-start pt-0 pl-0  ${
          isAskAiPending || isMessagePending ? "justify-between" : "justify-end"
        }`}
      >
        {isMessagePending && (
          <div className='flex items-center gap-4'>
            <p className='text-14 text-neutral-800 dark:text-neutral-300'>Updating...</p>
            <ClipLoader color='#2285E1' size={18} />
          </div>
        )}
        {isAskAiPending && (
          <div className='flex items-center gap-4'>
            <p className='text-14 text-neutral-800 dark:text-neutral-300'>Updating by AI...</p>
            <ClipLoader color='#2285E1' size={18} />
          </div>
        )}
        <div className='relative flex items-center justify-end gap-4'>
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
                  // handleButtonClick(event.emoji);
                  // setIsManualChange(true);
                }}
                height={350}
                searchDisabled
                previewConfig={{ showPreview: false }}
              />
            </PopoverButton>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EditPanel;
