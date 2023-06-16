import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { type CT_TACGIA, type DAUSACH } from "@prisma/client";
import { api } from "@/utils/api";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Input,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, PencilIcon } from "@heroicons/react/24/outline";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import {
  Pagination,
  PaginationWrapper,
} from "@/components/pagination/pagination";
import TitleModal from "@/components/modals/TitleModal";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import useModal from "@/hook/useModal";
import useDebounce from "@/hook/useDebounce";

const ConfirmModal = dynamic(() => import("@/components/modals/ConfirmModal"));

const TABLE_HEADER = ["ID", "Tên đầu sách", "Thê loại", "Tác giả"];

const DauSach: NextPageWithLayout = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const [searchValueDebounced, setSearchValueDebounced] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debounced = useDebounce({ value: searchValue, delay: 500 });

  const { open: openTitleModal, handleOpen: handleOpenTitleModal } = useModal();
  const { open: openConfirmModal, handleOpen: handleOpenConfirmModal } =
    useModal();
  const [currentItem, setCurrentItem] = useState<
    | (DAUSACH & {
        CT_TACGIA: CT_TACGIA[];
      })
    | null
  >(null);
  const utils = api.useContext();
  const { data: categoryData, isLoading: isLoadingCategory } =
    api.category.getAll.useQuery();
  const { data: authorData, isLoading: isLoadingAuthor } =
    api.author.getAll.useQuery();
  const { data, isLoading } = api.title.getWithPagination.useQuery({
    limit: 10,
    page: pageIndex + 1,
    searchValue: searchValueDebounced,
  });
  const { mutate: deleteTitle } = api.title.delete.useMutation({
    async onSuccess() {
      setCurrentItem(null);
      if (data?.datas.length === 1 && pageIndex !== 0) {
        setPageIndex((p) => p - 1);
        await utils.author.getAll.refetch();
      } else {
        await utils.title.getWithPagination.refetch();
        await utils.author.getAll.refetch();
      }
      toast.success("Xóa thành công");
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleConfirmDelete = () => {
    currentItem && deleteTitle({ MaDauSach: currentItem.MaDauSach });
  };

  useEffect(() => {
    setSearchValueDebounced(searchValue);
    setPageIndex(0);
  }, [debounced]);

  return (
    <>
      <Head>
        <title>Quản lý đầu sách</title>
      </Head>
      <div className="mb-8 mt-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Danh sách đầu sách
            </Typography>
            <Button
              variant="outlined"
              className="bg-white"
              onClick={() => handleOpenTitleModal()}
            >
              Thêm đầu sách
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
                  {TABLE_HEADER.map((head) => {
                    return (
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
                    );
                  })}
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
                    <td colSpan={3}>
                      <LoadingScreen />
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  data &&
                  data.datas.map(
                    ({ MaDauSach, TenDauSach, MaTL, CT_TACGIA }, index) => {
                      const isLast = index === data.datas.length - 1;
                      const className = isLast
                        ? "p-4 "
                        : "p-4 border-b border-blue-gray-50";
                      return (
                        <tr key={MaDauSach}>
                          <td className={`${className} w-1/12`}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {MaDauSach}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {TenDauSach}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {isLoadingCategory
                                ? "Đang tải..."
                                : categoryData?.find((i) => i.MaTL === MaTL)
                                    ?.TenTL}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {isLoadingAuthor ? (
                                "Đang tải..."
                              ) : authorData?.find((i) =>
                                  i.CT_TACGIA.some(
                                    (cttg) => cttg.MaDauSach === MaDauSach
                                  )
                                ) ? (
                                <Menu>
                                  <MenuHandler>
                                    <Button size="sm">Danh sách tác giả</Button>
                                  </MenuHandler>
                                  <MenuList>
                                    {authorData
                                      ?.filter((i) =>
                                        i.CT_TACGIA.some(
                                          (cttg) => cttg.MaDauSach === MaDauSach
                                        )
                                      )
                                      ?.map((i) => (
                                        <MenuItem key={i.MaTG}>
                                          {i.TenTG}
                                        </MenuItem>
                                      ))}
                                  </MenuList>
                                </Menu>
                              ) : (
                                "Chưa có tác giả"
                              )}
                            </Typography>
                          </td>
                          <td className={`${className} w-2/12`}>
                            <div className="flex w-full justify-center">
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={() => {
                                  setCurrentItem({
                                    MaDauSach,
                                    TenDauSach,
                                    MaTL,
                                    CT_TACGIA,
                                  });
                                  handleOpenTitleModal(true);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                              {/* <IconButton
                                variant="text"
                                color="red"
                                onClick={() => {
                                  setCurrentItem({
                                    MaDauSach,
                                    TenDauSach,
                                    MaTL,
                                    CT_TACGIA,
                                  });
                                  handleOpenConfirmModal(true);
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton> */}
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
      <TitleModal
        open={openTitleModal}
        handleOpen={handleOpenTitleModal}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
      <ConfirmModal
        open={openConfirmModal}
        handleOpen={handleOpenConfirmModal}
        title="Xóa đầu sách"
        content="Đầu sách này sẽ hoàn toàn bị xóa khỏi cơ sở dữ liệu. Bạn có muốn xóa?"
        cb={handleConfirmDelete}
      />
    </>
  );
};
DauSach.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default DauSach;
