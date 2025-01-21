import React from "react";

import emptyImage from "../../../assets/errors/empty.png";

type Props = {
  label?: string;
  height?: string;
};

const TableEmpty: React.FC<Props> = ({ label, height }) => {
  return (
    <tbody className={`${height ? `${height}` : "h-500"}`}>
      <tr
        className={`absolute flex flex-col items-center justify-center w-full ${
          height ? `${height}` : "h-500"
        }`}
      >
        <td className='flex flex-col items-center justify-center gap-20'>
          <img src={emptyImage} className='w-180 h-180' />
          <p className='font-medium text-16'>{label ?? "No Data!"}</p>
        </td>
      </tr>
    </tbody>
  );
};

export default TableEmpty;
