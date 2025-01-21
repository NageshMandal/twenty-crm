import React from "react";
import Icon from "src/components/base/Icon";

const SplashScreen: React.FC = () => (
  <div className='flex items-center justify-center w-screen h-screen bg-bodyBgColor dark:bg-bodyBgColor-dark'>
    <div className='relative w-130 h-130 flex justify-center items-center'>
      <Icon name='Logo' className='w-50 h-50 animate-bounce' />
    </div>
  </div>
);

export default SplashScreen;
