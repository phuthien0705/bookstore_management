import useUserDebtState from "@/hook/bao-cao/useUserDebtState";
import { api } from "@/utils/api";
import { moneyFormat } from "@/utils/moneyFormat";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import MonthYearInputSection from "./MonthYearInputSection";

const TABLE_HEAD = ["STT", "Mã khách hàng", "Nợ đầu", "Phát sinh", "Nợ cuối"];

const UserDebtPanel = () => {
  const {
    state,
    data,
    queryReturn: { fetchNextPage, isFetching, data: queryData },
  } = useUserDebtState();

  const { ref, inView } = useInView();

  const { mutate } = api.statistic.exportUserDebtExcel.useMutation({
    onSuccess(data) {
      const mediaType =
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";

      window.location.href = `${mediaType}${data.stream}`;
    },
  });

  useEffect(() => {
    const pages = queryData?.pages;
    if (inView && !isFetching && pages?.[pages?.length - 1]?.hasNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isFetching, queryData?.pages]);

  return (
    <div className="mb-8 mt-12 rounded-lg">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-2 px-6 py-4">
          <Typography variant="h6" color="white">
            Báo cáo công nợ của từng khách hàng theo tháng và năm
          </Typography>
        </CardHeader>
        <CardBody className="p-4">
          <MonthYearInputSection {...state} />
          <Button
            onClick={() =>
              mutate({ month: Number(state.month), year: Number(state.year) })
            }
            className="mb-5"
          >
            Xuất excel
          </Button>
          <div className="relative">
            {isFetching && (
              <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex w-full items-center justify-center bg-gray-50/70 ">
                <Spinner className="h-10 w-10" />
              </div>
            )}
            {!data || data.length === 0 ? (
              <div className="flex w-full justify-center py-6">
                <Typography variant="h6">Chưa có dữ liệu</Typography>
              </div>
            ) : (
              <Card className="h-full w-full">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th
                          key={head}
                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(
                      (
                        { MaKH, TonDau: NoDau, TonCuoi: NoCuoi, PhatSinh },
                        index
                      ) => {
                        return (
                          <tr key={MaKH} className="even:bg-blue-gray-50/50">
                            <td className={"border-b border-blue-gray-50 p-4"}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {index + 1}
                              </Typography>
                            </td>
                            <td className={"border-b border-blue-gray-50 p-4"}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {MaKH}
                              </Typography>
                            </td>
                            <td className={"border-b border-blue-gray-50 p-4"}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {moneyFormat(Number(NoDau))}đ
                              </Typography>
                            </td>
                            <td className={"border-b border-blue-gray-50 p-4"}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {moneyFormat(Number(PhatSinh))}đ
                              </Typography>
                            </td>
                            <td className={"border-b border-blue-gray-50 p-4"}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                              >
                                {moneyFormat(Number(NoCuoi))}đ
                              </Typography>
                            </td>
                          </tr>
                        );
                      }
                    )}
                    <tr ref={ref} />
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserDebtPanel;
