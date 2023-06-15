import { getRndInteger } from "@/utils/number";
import { useState } from "react";

const useUserDebtState = () => {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const data = new Array(20).fill(0).map((_, index) => {
    const noDau = getRndInteger(35000000, 10000000);
    const phatSinh = getRndInteger(5000000, 500000);

    return {
      maKH: index + 1,
      noDau,
      phatSinh,
      noCuoi: noDau + phatSinh,
    };
  });

  return {
    state: {
      month,
      setMonth,
      year,
      setYear,
    },
    data,
  };
};

export default useUserDebtState;
