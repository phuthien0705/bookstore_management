import { LoadingScreen } from "@/components/loading/LoadingScreen";
import {
  Pagination,
  PaginationWrapper,
} from "@/components/pagination/pagination";
import useDebounce from "@/hook/useDebounce";
import useModal from "@/hook/useModal";
import useValidateUser from "@/hook/useValidateUser";
import DashboardLayout from "@/layouts/dashboard";
import { api } from "@/utils/api";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { type TAIKHOAN } from "@prisma/client";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { type NextPageWithLayout } from "../page";

const ManageStaffModal = dynamic(
  () => import("@/components/modals/ManageStaffModal")
);
const StaffModal = dynamic(() => import("@/components/modals/StaffModal"));

const StaffPage: NextPageWithLayout = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { open: openAccountModal, handleOpen: handleOpenAccountModal } =
    useModal();
  const { open: openManageStaffModal, handleOpen: handleOpenManageStaffModel } =
    useModal();
  const [currentItem, setCurrentItem] = useState<TAIKHOAN | null>(null);
  const [searchValueDebounced, setSearchValueDebounced] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debounced = useDebounce({ value: searchValue, delay: 500 });
  const { data, isLoading } = api.account.getStaffWithPagination.useQuery({
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
        <title>Quản lý nhân viên</title>
      </Head>
      <div className="mb-8 mt-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-8 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Danh sách nhân viên
            </Typography>
            <Button
              variant="outlined"
              className="bg-white"
              onClick={() => handleOpenAccountModal()}
            >
              Thêm nhân viên
            </Button>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pb-2 pt-0">
            <div className="m-4 flex justify-end">
              <div className="w-full md:w-56">
                <Input
                  label="Tìm kiếm"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {["Mã nhân viên", "Tên đăng nhập", "Mật khẩu"].map((head) => (
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
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="text-center font-normal leading-none opacity-70"
                    >
                      Thao tác
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={4}>
                      <LoadingScreen />
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  data &&
                  data.datas.map(
                    ({ MaTK, TenDangNhap, MatKhau, MaNhom }, index) => {
                      const isLast = index === data.datas.length - 1;
                      const className = isLast
                        ? "p-4 "
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={MaTK}>
                          <td className={`${className}`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {MaTK}
                            </Typography>
                          </td>
                          <td className={`${className}`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {TenDangNhap}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              ******
                            </Typography>
                          </td>

                          <td className={`${className} w-2/12`}>
                            <div className="flex w-full justify-center">
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={() => {
                                  setCurrentItem({
                                    MaTK,
                                    TenDangNhap,
                                    MatKhau,
                                    MaNhom,
                                  });
                                  handleOpenAccountModal(true);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={() => {
                                  setCurrentItem({
                                    MaTK,
                                    TenDangNhap,
                                    MatKhau,
                                    MaNhom,
                                  });
                                  handleOpenManageStaffModel(true);
                                }}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                            </div>
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
      <StaffModal
        open={openAccountModal}
        handleOpen={handleOpenAccountModal}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
      <ManageStaffModal
        open={openManageStaffModal}
        handleOpen={handleOpenManageStaffModel}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
    </>
  );
};

StaffPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default StaffPage;
