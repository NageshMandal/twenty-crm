import { ISelectOption } from "../../../../../utils/types";
const functionOption = [
  "Accounting",
  "Engineering",
  "Administration",
  "Education",
  "Finance",
  "Healthcare",
  "HR",
  "Legal",
  "Sales",
  "Real Estate",
  "IT",
  "Military",
  "Marketing",
  "Quality Assurance",
  "Consulting",
  "Research",
  "Writing / Editing",
  "Training",
  "Supply Chain",
  "Strategy / Planning",
  "Science",
  "Research",
  "QualityAssurance",
  "Production",
  "Project Management",
  "Product Management",
  "Purchasing",
  "Public Relations",
  "Other",
  "Marketing",
  "Manufacturing",
  "Management",
  "Information Technology",
  "HealthCare Provider",
  "Distribution",
  "Consulting",
  "Business Development",
  "Advertising",
  "Analyst",
];

interface Props {
  value?: ISelectOption[];
  handleInputChange: (e: ISelectOption) => void;
}
const Functions: React.FC<Props> = ({ value, handleInputChange }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>Function</span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (optional)
      </span>
    </div>
    <div className='flex gap-6 flex-wrap'>
      {functionOption.map((item) => (
        <div
          key={item}
          className={`border-2 rounded py-2 px-5 text-sm min-w-80 cursor-pointer text-center ${
            value?.some((eachValue) => eachValue.value === item) ? "bg-primary-1" : "bg-red-1"
          } ${
            value?.some((eachValue) => eachValue.value === item)
              ? "text-white dark:text-neutral-200 "
              : "text-black dark:text-neutral-200"
          }`}
          onClick={() => handleInputChange({ label: "function", value: item })}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export default Functions;
