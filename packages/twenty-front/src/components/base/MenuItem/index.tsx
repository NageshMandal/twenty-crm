import React from "react";
import classNames from "classnames";

import styles from "./styles.module.scss";
import Icon from "../Icon";

type Props = {
  className?: string;
  label: string;
  open: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const MenuItem: React.FC<Props> = ({ className = "", label, open = false, onClick = () => {} }) => {
  return (
    <div role='button' onClick={onClick} className={classNames(className, styles.defaultStyle)}>
      <Icon name='Pen' className='flex-none w-20 h-20 ml-5' />
      <p className={classNames(styles.label, { [styles.active]: open })}>{label}</p>
    </div>
  );
};

export default MenuItem;
