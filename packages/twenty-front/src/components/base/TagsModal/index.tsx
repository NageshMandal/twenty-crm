import React, { Fragment, ReactNode, useRef, useState } from "react";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

import Icon from "../Icon";
import useOutsideClick from "../../../hook/common/useOutsideClick";
import axios from "src/utils/functions/axios";
import { toast } from "react-toastify";

type ModalProps = {
  show: boolean;
  onClose?: Function;
  disabled?: boolean;
  className?: string;
  hideClose?: boolean;
  tags?: any;
  handleGetTags?: any;
};

// Define the allowed colors for the tags
const allowedColors = [
  "D24D57",
  "E74C3C",
  "D2527F",
  "EC644B",
  "90C695",
  "87D37C",
  "65C6BB",
  "1BA39C",
  "4ECDC4",
  "03C9A9",
  "446CB3",
  "4183D7",
  "59ABE3",
  "3498DB",
  "4B77BE",
  "2574A9",
  "EB974E",
  "D35400",
  "F27935",
  "F2784B",
  "F89406",
  "6C7A89",
  "95A5A6",
  "AEA8D3",
];

const TagsModal: React.FC<ModalProps> = ({
  show = false,
  onClose = () => {},
  disabled = false,
  className = "",
  hideClose = false,
  tags,
  handleGetTags,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [editableTagId, setEditableTagId] = useState<number | null>(null);
  const [newTagName, setNewTagName] = useState<string>("");
  const [newTagColor, setNewTagColor] = useState<string>(allowedColors[0]); // Default color
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  useOutsideClick(ref, () => {
    if (!disabled) onClose();
  });

  async function handleDeleteClick(tagId: any) {
    try {
      await axios(true).delete(`${process.env.REACT_APP_DEMAND_API_URL}/tags/${tagId}`);
      handleGetTags();
      toast.success("Tag deleted successfully!");
    } catch (error) {
      console.error("Error deleting mailbox:", error);
    }
  }

  async function handleSaveClick(tagId: number) {
    try {
      await axios(true).put(`${process.env.REACT_APP_DEMAND_API_URL}/tags/${tagId}`, {
        name: newTagName,
      });
      // Update local state or refetch tags if needed
      setEditableTagId(null);
      setNewTagName("");
      handleGetTags();
      toast.success("Tag updated successfully!");
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  }

  const handleEditClick = (tagId: number, tagName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up and closing the modal
    setEditableTagId(tagId);
    setNewTagName(tagName);
  };

  async function handleCreateClick() {
    if (!newTagName || !newTagColor) {
      toast.error("Please provide both a name and color for the new tag.");
      return;
    }

    try {
      await axios(true).post(`${process.env.REACT_APP_DEMAND_API_URL}/tags`, {
        name: newTagName,
        color: newTagColor.replace("#", "").trim().toUpperCase(), // remove the '#' from color
      });
      setNewTagName("");
      setNewTagColor(allowedColors[0]); // Reset color picker to default
      handleGetTags();
      toast.success("Tag created successfully!");
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  }

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <div className='relative z-50 dark:scrollbar-thumb-neutral-700 scrollbar-thumb-neutral-300 scrollbar-thin'>
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
          <div className='fixed inset-0 z-50 flex items-end justify-center py-20 overflow-hidden tablet:items-center'>
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
                <div className={classNames("h-full tablet:p-20 p-15", className)}>
                  <div className='w-full pt-20'>
                    {/* New Tag Input */}
                    <div className='flex items-center space-x-4 mb-6'>
                      {/* Compact Color Picker */}
                      <div className='relative inline-block'>
                        {/* Trigger Button to Open Color Picker */}
                        <button
                          className='w-25 h-25 rounded-full border border-gray-300 dark:border-neutral-700 focus:outline-none'
                          style={{ backgroundColor: `#${newTagColor}` }}
                          onClick={() => setIsPickerOpen(!isPickerOpen)}
                        >
                          {/* Display the selected color */}
                        </button>

                        {/* Dropdown-like Color Picker Box */}
                        {isPickerOpen && (
                          <div
                            className='absolute mt-2 left-0 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg p-4 z-10 w-max'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className='grid grid-cols-5 gap-20'>
                              {allowedColors.map((color) => (
                                <button
                                  key={color}
                                  style={{
                                    backgroundColor: `#${color}`,
                                    border:
                                      newTagColor === color
                                        ? "2px solid #000"
                                        : "2px solid transparent",
                                  }}
                                  className='w-25 h-25 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-110'
                                  onClick={() => {
                                    setNewTagColor(color);
                                    setIsPickerOpen(false); // Close the color picker after selecting
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* <input
                        type='color'
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className='w-25 h-25 p-0 border-none'
                      /> */}
                      <input
                        type='text'
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder='Enter new tag name'
                        className='p-8 text-neutral-800 dark:text-neutral-200 text-base bg-white dark:bg-neutral-700 rounded-lg flex-1'
                      />
                      <button
                        onClick={handleCreateClick}
                        className='p-8 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200'
                      >
                        Create New
                      </button>
                    </div>
                    {/* {tags.map((tag) => (
                      <span
                        key={tag.id}
                        className='px-4 py-2 rounded-full text-sm'
                        style={{ backgroundColor: tag.color, color: "#fff" }}
                      >
                        {tag.name}
                      </span>
                    ))} */}
                    <ul className='space-y-4'>
                      {tags.map((tag) => (
                        <li
                          key={tag.id}
                          className='flex items-center justify-between p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200'
                        >
                          <div
                            className='w-24 h-24 rounded-full mr-4'
                            style={{ backgroundColor: `#${tag.color}` }}
                          ></div>
                          {editableTagId === tag.id ? (
                            <input
                              type='text'
                              value={newTagName}
                              onChange={(e) => setNewTagName(e.target.value)}
                              className='p-2 text-neutral-800 dark:text-neutral-200 text-base bg-white dark:bg-neutral-700 rounded-lg'
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveClick(tag.id);
                                }
                              }}
                            />
                          ) : (
                            <span className='flex-1 text-neutral-800 dark:text-neutral-200 text-base'>
                              {tag.name}
                            </span>
                          )}
                          {/* <span className='p-4 text-neutral-800 dark:text-neutral-200 text-16'>
                            {tag.name}
                          </span> */}
                          <div className='flex space-x-8'>
                            {editableTagId === tag.id ? (
                              <button
                                className='p-4 rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors duration-200'
                                onClick={() => handleSaveClick(tag.id)}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                className='p-4 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200'
                                onClick={(e) => handleEditClick(tag.id, tag.name, e)}
                              >
                                <Icon
                                  name='Pen'
                                  className='p-4 w-24 h-24 dark:text-neutral-200 text-neutral-800'
                                />
                              </button>
                            )}
                            {/* <button
                              className='p-4 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200'
                              onClick={() => console.log(`Edit ${tag.name}`)}
                            >
                              <Icon
                                name='Pen'
                                className='p-4 w-24 h-24 dark:text-neutral-200 text-neutral-800'
                              />
                            </button> */}
                            <button
                              className='p-4 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors duration-200'
                              onClick={() => console.log(`Delete ${tag.name}`)}
                            >
                              <Icon
                                name='Trash'
                                className='p-4 w-24 h-24 dark:text-neutral-200 text-neutral-800'
                                onClick={() => handleDeleteClick(tag.id)}
                              />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default TagsModal;
