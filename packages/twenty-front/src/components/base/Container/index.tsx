import React, { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className, id }) => {
  return (
    <div id={id} className={`container max-w-1100 mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Container;
