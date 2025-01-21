import ReactSelect from "../../../../../components/base/ReactSelect";
import { ISelectOption } from "../../../../../utils/types";

interface Props {
  locations: ISelectOption[];
  value?: ISelectOption[];
  handleInputChange: (e: { label: string; value: string[] }) => void;
}
const ContactLocation: React.FC<Props> = ({ locations, value, handleInputChange }) => (
  <div className='flex flex-col gap-12'>
    <div className='w-full flex px-5 mb-4 gap-3'>
      <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
        {/* Current Location */}
        Person Location
      </span>
      <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
        (optional)
      </span>
    </div>
    <ReactSelect
      placeholder='Select a location'
      smallMenu
      isMulti
      options={locations}
      value={value}
      onChange={(events) => {
        handleInputChange({
          label: "contactLocation",
          value: events.map((event) => event.value),
        });
      }}
    />
  </div>
);

export default ContactLocation;
