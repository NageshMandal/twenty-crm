import React from "react";

type Props = {
  rowCount: number;
  cellCount: number;
};

const TableSkeleton: React.FC<Props> = ({ rowCount, cellCount }) => (
  <>
    {[...new Array(rowCount).keys()].map((rowItem) => (
      <tr key={rowItem}>
        {[...new Array(cellCount).keys()].map((cellItem) => (
          <td key={cellItem} className='px-12 py-14'>
            <div className='w-full rounded-full bg-neutral-400/50 h-14 animate-pulse dark:bg-neutral-700' />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default TableSkeleton;
