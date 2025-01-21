import axios from "axios";
import { useEffect, useState } from "react";

import ReactSelect from "../../../../../components/base/ReactSelect";
import { ISelectOption } from "../../../../../utils/types";
interface Props {
  value?: ISelectOption[];
  handleInputChange: (e: { label: string; value: string[] }) => void;
}
const Personas: React.FC<Props> = ({ value, handleInputChange }) => {
  const [personas, setPersonas] = useState<ISelectOption[]>([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      const response = await axios.get("https://app.usedemand.com/api/personas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPersonas(response.data.data);
    };
    fetchPersonas();
  }, []);

  return (
    <div className='flex flex-col gap-12'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className={`font-bold text-neutral-800 dark:text-neutral-200 text-base`}>
          Personas
        </span>
        <span className={`font-normal  dark:text-neutral-200 text-base text-[#94A3B8]`}>
          (ideal)
        </span>
      </div>
      <ReactSelect
        placeholder='Select a persona'
        smallMenu
        isMulti
        options={personas}
        value={value}
        onChange={(events) => {
          handleInputChange({
            label: "personas",
            value: events.map((event) => event.value),
          });
        }}
      />
    </div>
  );
};

export default Personas;
