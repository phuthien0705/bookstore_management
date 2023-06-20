import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Input, Typography } from "@material-tailwind/react";
import { type Dispatch, type SetStateAction } from "react";

interface IMonthYearInputSection {
  month: string;
  year: string;
  setMonth: Dispatch<SetStateAction<string>>;
  setYear: Dispatch<SetStateAction<string>>;
}

const MonthYearInputSection = ({
  month,
  year,
  setMonth,
  setYear,
}: IMonthYearInputSection) => {
  return (
    <div className="my-4 flex w-fit items-center justify-between gap-6">
      <div>
        <Input
          label="Tháng"
          value={month}
          onChange={(e) => {
            if (e.target.value.includes("-")) return;
            setMonth(e.target.value);
          }}
          className="w-[250px]"
          min={1}
          max={12}
        />
        <Typography
          variant="small"
          color="gray"
          className="mt-2 flex items-center gap-1 font-normal"
        >
          <InformationCircleIcon className="-mt-px h-4 w-4" />
          Giá trị nằm trong khoảng từ 1 tới 12.
        </Typography>
      </div>
      <div>
        <Input
          label="Năm"
          value={year}
          onChange={(e) => {
            if (e.target.value.includes("-")) return;
            setYear(e.target.value);
          }}
          className="w-[250px]"
          min={0}
        />
        <Typography
          variant="small"
          color="gray"
          className="mt-2 flex items-center gap-1 font-normal"
        >
          <InformationCircleIcon className="-mt-px h-4 w-4" />
          Giá trị không được bé hơn 1.
        </Typography>
      </div>
    </div>
  );
};

export default MonthYearInputSection;
