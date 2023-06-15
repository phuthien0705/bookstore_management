import useBookLeftState from "@/hook/bao-cao/useBookLeftState";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import MonthYearInputSection from "./MonthYearInputSection";

const TABLE_HEAD = ["STT", "Mã sách", "Tồn đầu", "Phát sinh", "Tồn cuối"];

const BookLeftPanel = () => {
  const {
    state,
    data,
    queryReturn: { fetchNextPage, isFetching, data: queryData },
  } = useBookLeftState();

  const { ref, inView } = useInView();

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
            Báo cáo tồn của sách theo tháng và năm
          </Typography>
        </CardHeader>
        <CardBody className="p-4">
          <MonthYearInputSection {...state} />
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
                    {data &&
                      data?.map(
                        ({ MaSach, TonCuoi, TonDau, PhatSinh }, index) => {
                          return (
                            <tr
                              key={MaSach}
                              className="even:bg-blue-gray-50/50"
                            >
                              <td
                                className={"border-b border-blue-gray-50 p-4"}
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {index + 1}
                                </Typography>
                              </td>
                              <td
                                className={"border-b border-blue-gray-50 p-4"}
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {MaSach}
                                </Typography>
                              </td>
                              <td
                                className={"border-b border-blue-gray-50 p-4"}
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {TonDau}
                                </Typography>
                              </td>
                              <td
                                className={"border-b border-blue-gray-50 p-4"}
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {PhatSinh}
                                </Typography>
                              </td>
                              <td
                                className={"border-b border-blue-gray-50 p-4"}
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-medium"
                                >
                                  {TonCuoi}
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

export default BookLeftPanel;
