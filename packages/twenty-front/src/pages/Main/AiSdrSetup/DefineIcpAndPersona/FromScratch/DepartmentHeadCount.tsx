import Input from "../../../../../components/base/Input";
import ReactSelect from "../../../../../components/base/ReactSelect";

interface Props {
  value?: {
    min: number;
    max: number;
  };
  depValue?: {
    department: string;
  };
  handleInputChange: (e: { label: string; min: number; max: number }) => void;
  handleDepartmentChange: (value: string) => void;
}

const attachments = [
  "Accounting",
  "Administrative",
  "Arts and Design",
  "Business Development",
  "Community and Social Services",
  "Consulting",
  "Education",
  "Engineering",
  "Entrepreneurship",
  "Finance",
  "Healthcare Services",
  "Human Resources",
  "Information Technology",
  "Legal",
  "Marketing",
  "Media and Communication",
  "Military and Protective Services",
  "Operations",
  "Product Management",
  "Program and Project Management",
  "Purchasing",
  "Quality Assurance",
  "Real Estate",
  "Research",
  "Sales",
  "Support",
];

const DepartmentHeadCount: React.FC<Props> = ({
  value,
  depValue,
  handleInputChange,
  handleDepartmentChange,
}) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        Department Headcount
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (optional)
      </span>
    </div>
    <ReactSelect
      placeholder='Select Department'
      label='Department'
      smallMenu
      options={attachments.map((attachment) => ({ label: attachment, value: attachment }))}
      value={depValue?.department}
      onChange={handleDepartmentChange}
    />
    <div className='flex items-center gap-12'>
      <Input
        fullWidth
        placeholder='Min(%)'
        value={value?.min}
        onChange={(e) =>
          handleInputChange({
            label: "departmentHeadCount",
            min: Number(e.target.value),
            max: value?.max,
          })
        }
      />
      <span className='text-base'>to</span>
      <Input
        fullWidth
        placeholder='Max(%)'
        value={value?.max}
        onChange={(e) =>
          handleInputChange({
            label: "departmentHeadCount",
            min: value?.min,
            max: Number(e.target.value),
          })
        }
      />
    </div>
  </div>
);

export default DepartmentHeadCount;
