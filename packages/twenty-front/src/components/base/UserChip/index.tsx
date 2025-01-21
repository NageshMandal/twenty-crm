import React from "react";

import userAvatar from "../../../assets/images/user.jpg";

type Props = {
  avatar?: string;
  label?: string;
};

const UserChip: React.FC<Props> = ({ avatar, label }) => {
  return (
    <div className='flex items-center gap-4 bg-primary-3 dark:bg-menuItemDefault border border-blue-500 p-4 pr-6 rounded-full overflow-hidden w-fit'>
      <img
        src={avatar ?? userAvatar}
        alt='avatar'
        className='w-22 h-22 overflow-hidden rounded-full'
      />
      <p className='text-neutral-600 dark:text-neutral-300 text-14'>{label ?? ""}</p>
    </div>
  );
};

export default UserChip;
