import { useEffect, useState } from "react";
import Avatar from "react-avatar";

type IAvatar = {
  name?: string;
  src: string;
  size: string;
  color?: string;
  className?: string;
};

const ReactAvatar: React.FC<IAvatar> = ({ name, src, size, className, color }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const width = img.width;
      if (width > 10) {
        setIsLoaded(true);
      }
    };
  }, [src]);
  return (
    <Avatar
      src={isLoaded ? src : ""}
      name={name?.replace(/^(\w)\w*\s(\w)\w*.*$/, "$1 $2")}
      size={size}
      className={`flex-none  ${className ? className : "rounded-sm"} `}
    />
  );
};

export default ReactAvatar;
