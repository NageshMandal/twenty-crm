import { useState } from "react";
import Input from "../../../../../components/base/Input";

interface Props {
  value?: {
    min: number;
    max: number;
  };
  handleInputChange: (e: { label: string; min: number; max: number }) => void;
}

const HeadCountGrowth: React.FC<Props> = ({ value, handleInputChange }) => {
  const [tempMin, setTempMin] = useState<number>(value?.min || 0);
  const [tempMax, setTempMax] = useState<number>(value?.max || 0);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setTempMin(newValue);
    handleInputChange({
      label: '"headCountGrowth"',
      min: newValue,
      max: tempMax,
    });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setTempMax(newValue);
    handleInputChange({
      label: '"headCountGrowth"',
      min: tempMin,
      max: newValue,
    });
  };

  return (
    <div className='flex flex-col gap-12'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className='font-bold text-neutral-800 dark:text-neutral-200 text-base'>
          Company Headcount
        </span>
        <span className='font-normal dark:text-neutral-200 text-base text-[#94A3B8]'>
          (optional)
        </span>
      </div>
      <div className='flex items-center gap-12'>
        <Input fullWidth placeholder='Min(%)' value={tempMin} onChange={handleMinChange} />
        <span className='text-base'>to</span>
        <Input fullWidth placeholder='Max(%)' value={tempMax} onChange={handleMaxChange} />
      </div>
    </div>
  );
};
export default HeadCountGrowth;
