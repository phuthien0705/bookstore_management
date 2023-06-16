import { api } from "@/utils/api";
import { useMemo, useState } from "react";

const useBookLeftState = () => {
  const [month, setMonth] = useState<string>(() =>
    (new Date().getMonth() + 1).toString()
  );
  const [year, setYear] = useState<string>(() =>
    new Date().getFullYear().toString()
  );

  const queryReturn = api.statistic.getBookLeftWithPagination.useInfiniteQuery(
    {
      month: Number(month),
      year: Number(year),
      limit: 10,
    },
    {
      enabled: !!month && !!year,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.cursor : undefined,
    }
  );

  const data = useMemo(() => {
    return queryReturn.data?.pages.map((item) => item.datas).flat();
  }, [queryReturn.data]);

  return {
    state: {
      month,
      setMonth,
      year,
      setYear,
    },
    data,
    queryReturn,
  };
};

export default useBookLeftState;
