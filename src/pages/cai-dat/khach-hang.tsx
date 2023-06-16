import { LoadingScreen } from "@/components/loading/LoadingScreen";
import {
  Pagination,
  PaginationWrapper,
} from "@/components/pagination/pagination";
import useDebounce from "@/hook/useDebounce";
import useValidateUser from "@/hook/useValidateUser";
import DashboardLayout from "@/layouts/dashboard";
import { api } from "@/utils/api";
import { moneyFormat } from "@/utils/moneyFormat";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AddCustomerButton } from "../chuc-nang/hoa-don";
import { type NextPageWithLayout } from "../page";

const CustomerPage: NextPageWithLayout = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const [searchValueDebounced, setSearchValueDebounced] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debounced = useDebounce({ value: searchValue, delay: 500 });
  const { data, isLoading } = api.account.getStaffWithPagination.useQuery({
    limit: 10,
    page: pageIndex + 1,
    searchValue: searchValueDebounced,
  });
  const { data: customers, isLoading: isLoadingCustomers } =
    api.customer.getWithPagination.useQuery({
      limit: 10,
      page: pageIndex + 1,
      searchValue: searchValueDebounced,
    });
  useValidateUser();
  useEffect(() => {
    setSearchValueDebounced(searchValue);
    setPageIndex(0);
  }, [debounced]);
  return (
    <>
      <Head>
        <title>Quản lý khách hàng</title>
      </Head>
      <div className="mb-8 mt-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-8 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Danh sách khách hàng
            </Typography>
            <AddCustomerButton variant="outlined" classname="bg-white" />
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pb-2 pt-0">
            <div className="m-4 flex justify-end">
              <div className="w-full md:w-56">
                <Input
                  label="Tìm kiếm"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchValue}
                  onChange={(e: any) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {[
                    "Mã khách hàng",
                    "Họ tên",
                    "Địa chỉ",
                    "SĐT",
                    "Email",
                    "Tiền nợ",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
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
                {isLoadingCustomers && (
                  <tr>
                    <td colSpan={6}>
                      <LoadingScreen />
                    </td>
                  </tr>
                )}
                {!isLoadingCustomers &&
                  customers &&
                  customers.datas.map(
                    (
                      { MaKH, HoTen, DiaChi, SoDienThoai, Email, TienNo },
                      index
                    ) => {
                      const isLast = index === customers.datas.length - 1;
                      const className = isLast
                        ? "p-4 "
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={MaKH}>
                          <td className={`${className}`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {MaKH}
                            </Typography>
                          </td>
                          <td className={`${className}`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {HoTen}
                            </Typography>
                          </td>
                          <td className={`${className}`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {DiaChi}
                            </Typography>
                          </td>{" "}
                          <td className={`${className}`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {SoDienThoai}
                            </Typography>
                          </td>{" "}
                          <td className={`${className}`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {Email}
                            </Typography>
                          </td>{" "}
                          <td className={`${className}`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {moneyFormat(Number(TienNo))}VNĐ
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
            {data && (
              <div className="">
                <PaginationWrapper>
                  <Pagination
                    gotoPage={setPageIndex}
                    canPreviousPage={pageIndex > 0}
                    canNextPage={pageIndex < data.totalPages - 1}
                    pageCount={data.totalPages}
                    pageIndex={pageIndex}
                  />
                </PaginationWrapper>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

CustomerPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default CustomerPage;
