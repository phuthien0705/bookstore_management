import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
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

const BookModal = dynamic(() => import("@/components/modals/BookModal"));
const ConfirmModal = dynamic(() => import("@/components/modals/ConfirmModal"));

const BookPage: NextPageWithLayout = () => {
  const utils = api.useContext();
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { open: openBookModal, handleOpen: handleOpenBookModal } = useModal();
  const { open: openConfirmModal, handleOpen: handleOpenConfirmModal } =
    useModal();
  const [currentItem, setCurrentItem] = useState<SACH | null>(null);
  const {
    data,
    isLoading: isBooksLoading,
    isFetching,
  } = api.sach.getWithPagination.useQuery({
    limit: 10,
    page: pageIndex + 1,
  });
  const { mutate: deleteBook } = api.sach.delete.useMutation({
    async onSuccess() {
      setCurrentItem(null);
      if (data?.datas.length === 1 && pageIndex !== 0) {
        setPageIndex((p) => p - 1);
      } else {
        await utils.tacGia.getWithPagination.refetch();
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
  console.log(data);

  const isLoading = isBooksLoading;

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
            className="mb-8 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Danh sách sách
            </Typography>
            <Button
              variant="outlined"
              className="bg-white"
              onClick={() => handleOpenBookModal()}
            >
              Thêm sách
            </Button>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pb-2 pt-0">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["ID", "Giá", "Số lượng tồn", "Thao tác"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 px-5 py-3 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
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
                  data.datas.map((item) => {
                    const className = `py-3 px-5`;
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
                          <div className="flex gap-3">
                            <Typography
                              onClick={() => {
                                setCurrentItem(item);
                                handleOpenBookModal(true);
                              }}
                              className="cursor-pointer text-xs font-semibold text-blue-gray-600"
                            >
                              Edit
                            </Typography>
                            <Typography
                              onClick={() => {
                                setCurrentItem(item);
                                handleOpenConfirmModal(true);
                              }}
                              className="cursor-pointer text-xs font-semibold text-red-600"
                            >
                              Delete
                            </Typography>
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
        title="Delete Author"
        content="The author will be permanently deleted. You are sure you want to delete?"
        cb={handleConfirmDelete}
      />
    </>
  );
};
BookPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default BookPage;
