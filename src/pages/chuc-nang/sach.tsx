import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { type SACH } from "@prisma/client";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import {
  Pagination,
  PaginationWrapper,
} from "@/components/pagination/pagination";
import useModal from "@/hook/useModal";
import { api } from "@/utils/api";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import useDebounce from "@/hook/useDebounce";

const BookModal = dynamic(() => import("@/components/modals/BookModal"));
const ConfirmModal = dynamic(() => import("@/components/modals/ConfirmModal"));

const BookPage: NextPageWithLayout = () => {
  const utils = api.useContext();
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { open: openBookModal, handleOpen: handleOpenBookModal } = useModal();
  const { open: openConfirmModal, handleOpen: handleOpenConfirmModal } =
    useModal();
  const [searchValueDebounced, setSearchValueDebounced] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debounced = useDebounce({ value: searchValue, delay: 500 });
  const [currentItem, setCurrentItem] = useState<SACH | null>(null);
  const { data, isLoading: isBooksLoading } =
    api.book.getWithPagination.useQuery({
      limit: 10,
      page: pageIndex + 1,
      searchValue: searchValueDebounced,
    });
  const { mutate: deleteBook } = api.book.delete.useMutation({
    async onSuccess() {
      setCurrentItem(null);
      if (data?.datas.length === 1 && pageIndex !== 0) {
        setPageIndex((p) => p - 1);
      } else {
        await utils.book.getWithPagination.refetch();
      }
      toast.success("Delete successfully");
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleConfirmDelete = () => {
    currentItem && deleteBook({ MaSach: currentItem.MaSach });
  };

  const isLoading = isBooksLoading;

  useEffect(() => {
    setSearchValueDebounced(searchValue);
    setPageIndex(0);
  }, [debounced]);

  return (
    <>
      <Head>
        <title>Quản lý sách</title>
      </Head>
      <div className="mb-8 mt-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-0 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Danh sách sách
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pb-2 pt-0">
            <div className="m-4 flex justify-end">
              <div className="w-full md:w-56">
                <Input
                  label="Tìm kiếm"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
            </div>
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {["ID", "Giá", "Số lượng tồn", "Thao tác"].map((head) => (
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
                {isLoading && (
                  <tr>
                    <td colSpan={3}>
                      <LoadingScreen />
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  data &&
                  data.datas.map((item, index) => {
                    const isLast = index === data.datas.length - 1;
                    const className = isLast
                      ? "p-4 "
                      : "p-4 border-b border-blue-gray-50";
                    return (
                      <tr key={item.MaSach}>
                        <td className={`${className} w-1/12`}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.MaSach}
                          </Typography>
                        </td>

                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.DonGiaBan}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.SoLuongTon}
                          </Typography>
                        </td>

                        <td className={`${className} w-2/12`}>
                          <div className="flex w-max">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => {
                                setCurrentItem(item);
                                handleOpenBookModal(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => {
                                setCurrentItem(item);
                                handleOpenConfirmModal(true);
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
      <BookModal
        open={openBookModal}
        handleOpen={handleOpenBookModal}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
      <ConfirmModal
        open={openConfirmModal}
        handleOpen={handleOpenConfirmModal}
        title="Xóa sách"
        content="Sách này sẽ bị xóa khỏi cơ sở dữ liệu. Bạn có muốn xóa?"
        cb={handleConfirmDelete}
      />
    </>
  );
};
BookPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default BookPage;
