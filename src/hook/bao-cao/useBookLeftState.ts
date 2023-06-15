import { getRndInteger } from "@/utils/number";
import { useState } from "react";

const useBookLeftState = () => {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const data = new Array(20).fill(0).map((_, index) => {
    const tonDau = getRndInteger(35000000, 10000000);
    const phatSinh = getRndInteger(5000000, 500000);

    return {
      maSach: index + 1,
      tonDau,
      phatSinh,
      tonCuoi: tonDau + phatSinh,
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

export default useBookLeftState;
