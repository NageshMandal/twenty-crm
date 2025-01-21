import React, { forwardRef, useMemo } from "react";
import DatePicker from "react-datepicker";
import { getMonth, getYear, eachYearOfInterval, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

import Input from "../Input";

type Props = {
  value?: string;
  onClick?: React.MouseEventHandler;
  label?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const CalendarInput = forwardRef<any, Props>(({ value, onClick, label, onChange }, ref) => (
  <div onClick={onClick} ref={ref}>
    <Input label={label} value={value} onChange={onChange} className='!py-10' />
  </div>
));

type DatePickerProps = {
  name: string;
  timePicker?: boolean;
  dateFormat?: string;
  locale?: string;
  label?: string;
  disabled?: boolean;
  startDate: Date | null;
  setStartDate: Function;
  endDate: Date | null;
  setEndDate: Function;
  setRange?: Function;
};

const DateRangePicker: React.FC<DatePickerProps> = ({
  timePicker = false,
  dateFormat = "MM/dd/yyyy",
  locale = "en",
  label,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setRange = () => {},
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = useMemo(() => {
    const startYear = new Date(1980, 0, 1);
    const endYear = new Date(2500, 0, 1);
    const yearList = eachYearOfInterval({ start: startYear, end: endYear }).map((year) =>
      year.getFullYear()
    );
    return yearList;
  }, []);

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const range = `${format(start, "yyyy-MM-dd")} and ${format(end, "yyyy-MM-dd")}`;
      setRange(range);
    }
  };

  return (
    <div className='relative w-full'>
      <DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className='m-10 flex justify-center gap-10'>
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className='text-white'
            >
              {"<"}
            </button>
            <select
              className='bg-primary py-2 px-4 text-white text-center border-primary-1 border focus-visible:!ring-0 focus-visible:!outline-none scrollbar-1'
              value={getYear(date)}
              onChange={(event) => changeYear(Number(event?.target?.value))}
            >
              {years.map((option) => (
                <option
                  key={option}
                  value={option}
                  className='bg-contentColor dark:bg-contentColor-dark text-neutral-800 dark:text-neutral-300 hover:!bg-hoverColor-dark appearance-none'
                >
                  {option}
                </option>
              ))}
            </select>
            <select
              className='bg-primary py-2 px-4 text-center text-white border-primary-1 border focus-visible:!ring-0 focus-visible:!outline-none max-h-100 overflow-auto'
              value={months[getMonth(date)]}
              onChange={(event) => changeMonth(months.indexOf(event?.target?.value))}
            >
              {months.map((option) => (
                <option
                  key={option}
                  value={option}
                  className='bg-contentColor dark:bg-contentColor-dark text-neutral-800 dark:text-neutral-300 hover:!bg-gray-100 leading-18'
                >
                  {option}
                </option>
              ))}
            </select>

            <button
              className='text-white'
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              {">"}
            </button>
          </div>
        )}
        selected={startDate}
        dateFormat={dateFormat}
        onChange={onChange}
        locale={locale}
        showTimeSelect={timePicker}
        showTimeSelectOnly={timePicker}
        timeIntervals={30}
        timeCaption='Time'
        customInput={<CalendarInput label={label} />}
        selectsRange
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default DateRangePicker;
