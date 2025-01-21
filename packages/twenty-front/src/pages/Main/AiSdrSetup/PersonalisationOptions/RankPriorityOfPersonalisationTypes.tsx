import React, { useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Button from "../../../../components/base/Button";
import Icon from "../../../../components/base/Icon";
interface Props {
  selectedTypesAndSignals: string[];
  onUpdateTypesAndSignalsOrders: (typesAndSignalsOrders: string[]) => void;
  onRemoveTypeAndSignal: (typeAndSignal: string) => void;
}

interface DragItem {
  index: number;
  type: string;
}

const ItemType = "TYPE_AND_SIGNAL";

const DraggableButton: React.FC<{
  typeAndSignal: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}> = ({ typeAndSignal, index, moveItem }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: DragItem) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { type: ItemType, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className='flex items-center gap-10 cursor-move'
    >
      <Button prefix='Briefcase' suffix='ArrowUpDown' className='flex items-center gap-10'>
        {typeAndSignal}
      </Button>
    </div>
  );
};

const RankPriorityOfPersonalisationTypes: React.FC<Props> = ({
  selectedTypesAndSignals,
  onUpdateTypesAndSignalsOrders,
  onRemoveTypeAndSignal,
}) => {
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newTypesAndSignals = [...selectedTypesAndSignals];
      const [draggedItem] = newTypesAndSignals.splice(dragIndex, 1);
      newTypesAndSignals.splice(hoverIndex, 0, draggedItem);
      onUpdateTypesAndSignalsOrders(newTypesAndSignals);
    },
    [selectedTypesAndSignals, onUpdateTypesAndSignalsOrders]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex flex-col gap-12'>
        <div className='w-full flex px-5 mb-4 gap-3'>
          <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
            Rank priority of Personalization types
          </span>
          <span className={`font-normal dark:text-neutral-200 text-base text-[#94A3B8]`}>
            (optional, drag and drop by order, choose which option is preferred, if no data is found
            on prospect it will look for the next personalisation type)
          </span>
        </div>
        <div className='flex flex-col gap-12'>
          {selectedTypesAndSignals.map((typeAndSignal, index) => (
            <div className='flex items-center gap-10'>
              <DraggableButton
                key={typeAndSignal}
                index={index}
                typeAndSignal={typeAndSignal}
                moveItem={moveItem}
              />
              <div
                className='flex items-center gap-5 cursor-pointer'
                onClick={() => onRemoveTypeAndSignal(typeAndSignal)}
              >
                <Icon name='Trash' className='w-20 h-20 text-neutral-800 dark:text-neutral-200' />
                <span className='text-neutral-800 dark:text-neutral-200'>Remove</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default RankPriorityOfPersonalisationTypes;
