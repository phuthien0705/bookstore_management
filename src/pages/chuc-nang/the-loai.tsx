import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { type THELOAI } from "@prisma/client";
import { api } from "@/utils/api";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import {
  Pagination,
  PaginationWrapper,
} from "@/components/pagination/pagination";
import useModal from "@/hook/useModal";
import useDebounce from "@/hook/useDebounce";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ConfirmModal = dynamic(() => import("@/components/modals/ConfirmModal"));
const CategoryModal = dynamic(
  () => import("@/components/modals/CategoryModal")
);

const CategoryPage: NextPageWithLayout = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const { open: openCategoryModal, handleOpen: handleOpenCategoryModal } =
    useModal();
  const { open: openConfirmModal, handleOpen: handleOpenConfirmModal } =
    useModal();
  const [currentItem, setCurrentItem] = useState<THELOAI | null>(null);
  const utils = api.useContext();
  const [searchValueDebounced, setSearchValueDebounced] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debounced = useDebounce({ value: searchValue, delay: 500 });
  const { data, isLoading } = api.category.getWithPagination.useQuery({
    limit: 10,
    page: pageIndex + 1,
    searchValue: searchValueDebounced,
  });
  const { mutate: deleteCategory } = api.category.delete.useMutation({
    async onSuccess() {
      setCurrentItem(null);
      if (data?.datas.length === 1 && pageIndex !== 0) {
        setPageIndex((p) => p - 1);
      } else {
        await utils.category.getWithPagination.refetch();
      }
      toast.success("Xóa thành công");
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleConfirmDelete = () => {
    currentItem && deleteCategory({ MaTL: currentItem.MaTL });
  };
  useEffect(() => {
    setSearchValueDebounced(searchValue);
    setPageIndex(0);
  }, [debounced]);
  return (
    <>
      <Head>
        <title>Quản lý thể loại</title>
      </Head>
      <div className="mb-8 mt-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Danh sách thể loại
            </Typography>
            <Button
              variant="outlined"
              className="bg-white"
              onClick={() => handleOpenCategoryModal()}
            >
              Thêm thể loại
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
                  {["ID", "Tên"].map((head) => (
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
                    <td colSpan={3}>
                      <LoadingScreen />
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  data &&
                  data.datas.map(({ MaTL, TenTL }, index) => {
                    const isLast = index === data.datas.length - 1;
                    const className = isLast
                      ? "p-4 "
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={MaTL}>
                        <td className={`${className}`}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {MaTL}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {TenTL}
                          </Typography>
                        </td>

                        <td className={`${className} w-2/12`}>
                          <div className="flex w-full justify-center">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => {
                                setCurrentItem({ MaTL, TenTL });
                                handleOpenCategoryModal(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => {
                                setCurrentItem({ MaTL, TenTL });
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
      <CategoryModal
        open={openCategoryModal}
        handleOpen={handleOpenCategoryModal}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
      <ConfirmModal
        open={openConfirmModal}
        handleOpen={handleOpenConfirmModal}
        title="Xóa thể loại"
        content="Thể loại này sẽ hoàn toàn bị xóa khỏi cơ sở dữ liệu. Bạn có muốn xóa?"
        cb={handleConfirmDelete}
      />
    </>
  );
};
CategoryPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default CategoryPage;
