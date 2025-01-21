import React from "react";

type Props = {
  children: React.ReactNode;
  label?: string;
  center?: boolean;
  className?: string;
};

const Tooltip: React.FC<Props> = ({ children, label, center, className }) => {
  return (
    <div className='relative flex group/tooltip'>
      {children}
      <span
        className={`group-hover/tooltip:opacity-100 transition-opacity bg-neutral-100 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 rounded-md absolute translate-y-full opacity-0 m-4 mx-auto whitespace-nowrap p-4 px-8 border-borderColor border dark:border-borderColor-dark z-30 select-none ${
          center ? "left-1/2 -translate-x-1/2" : "left-0"
        } ${className}`}
      >
        {label}
      </span>
    </div>
  );
};

export default Tooltip;
