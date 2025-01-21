import React from "react";

type Props = {
  label: string;
  count: number;
  onClick: Function;
  active: boolean;
};

const ListItem: React.FC<Props> = ({ label, count, onClick = () => {}, active }) => {
  return (
    <div
      role='button'
      onClick={() => onClick()}
      className={`flex justify-between items-center p-10 overflow-hidden transition-all duration-75 rounded-xl group ${
        active
          ? "dark:bg-hoverColor-dark bg-hoverColor2 "
          : "hover:bg-hoverColor dark:hover:bg-hoverColor-dark"
      }`}
    >
      <p
        className={`pl-4 font-medium text-14 text-neutral-800 group-hover:text-primary-1 dark:text-neutral-400 ${
          active ? "text-primary-1" : ""
        }`}
      >
        {label}
      </p>
      <div className='p-4'>
        <p className='font-medium text-12 text-neutral-800 dark:text-neutral-200 group-hover:text-primary-1'>
          {count > 99 ? "99+" : count}
        </p>
      </div>
    </div>
  );
};

export default ListItem;
