import React from "react";
import classNames from "classnames";

import Icon from "../../base/Icon";
import styles from "./styles.module.scss";
import { IMenuList } from "../../../utils/types";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  list: IMenuList[];
  open: boolean;
  handleChangeOpen?: Function;
};

const SideMenu: React.FC<Props> = ({ list, open, handleChangeOpen = () => {} }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (link: string) => {
    navigate(link);
    handleChangeOpen();
  };
  return (
    <div className='mt-10 overflow-auto scrollbar-thin dark:scrollbar-thumb-neutral-600 scrollbar-thumb-neutral-300 mb-80'>
      {list.map((subList, index) => (
        <div className='px-10 pt-20' key={index}>
          {!!subList?.title && (
            <div
              className={`text-neutral-700 dark:text-neutral-400 text-12 font-medium pb-10 whitespace-nowrap w-0 overflow-hidden ${
                open ? "w-full" : ""
              }`}
            >
              {subList?.title}
            </div>
          )}
          <div className='flex flex-col gap-6'>
            {subList.menuItems.map((item, itemIndex) => (
              <div
                className={classNames(styles.item, {
                  [styles.active]: pathname.includes(item.link),
                })}
                key={itemIndex + 1}
                role='button'
                onClick={() => handleClick(item.link)}
              >
                <Icon
                  name={item.icon}
                  className={classNames(styles.icon, {
                    [styles.stroke]: item.icon === "Setting" || item.icon === "Envelop",
                    [styles.fill]: !(item.icon === "Setting" || item.icon === "Envelop"),
                  })}
                />
                <div
                  className={classNames(styles.label, {
                    [styles.open]: open,
                    [styles.highlight]: pathname.includes(item.link),
                  })}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
