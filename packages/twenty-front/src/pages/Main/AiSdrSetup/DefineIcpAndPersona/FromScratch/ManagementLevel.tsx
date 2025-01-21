import { ISelectOption } from "../../../../../utils/types";
const managementLevelOption = [
  "Owner",
  "Founder",
  "C-Suite",
  "Partner",
  "VP",
  "Head",
  "Director",
  "Manager",
  "Senior",
  "Entry",
  "Intern",
];

interface Props {
  value?: ISelectOption[];
  handleInputChange: (e: ISelectOption) => void;
}
const ManagementLevel: React.FC<Props> = ({ value, handleInputChange }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Management level
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (optional)
      </span>
    </div>
    <div className='flex gap-6 flex-wrap'>
      {managementLevelOption.map((item) => (
        <div
          key={item}
          className={`border-2 rounded py-2 px-5 text-sm min-w-80 cursor-pointer text-center ${
            value?.some((eachValue) => eachValue.value === item) ? "bg-primary-1" : "bg-red-1"
          } ${
            value?.some((eachValue) => eachValue.value === item)
              ? "text-white dark:text-neutral-200"
              : "text-black dark:text-neutral-200"
          }`}
          onClick={() => handleInputChange({ label: "managementLevel", value: item })}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export default ManagementLevel;
