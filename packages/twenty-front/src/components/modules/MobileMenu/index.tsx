import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import classNames from "classnames";

import Icon from "../../base/Icon";
import MenuItem from "../../base/MenuItem";
import SideMenu from "../SideMenu";
import styles from "./styles.module.scss";
import { menuPaths } from "../../../routes/menuPaths";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: Function;
};

const MobileMenu: React.FC<Props> = ({ sidebarOpen, setSidebarOpen = () => {} }) => {
  const handleClose = () => setSidebarOpen(false);

  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <div className={styles.wrapper}>
        <div className={styles.dialog}>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-100 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-100 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <div className={styles.content}>
              <div className={styles.main}>
                <div className={styles.logoWrapper}>
                  <div className={styles.iconWrapper}>
                    <Icon name='Logo' className={styles.icon} onClick={() => handleClose()} />
                  </div>
                  <h2 className={classNames(styles.logoTitle, { [styles.active]: true })}>
                    Demand
                  </h2>
                </div>
                <MenuItem open={true} className={styles.button} label='Create Automation' />
                <SideMenu open={true} list={menuPaths} />
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition.Root>
  );
};

export default MobileMenu;
