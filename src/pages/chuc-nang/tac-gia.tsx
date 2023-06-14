import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/layouts/dashboard";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { type TACGIA } from "@prisma/client";
import { type NextPageWithLayout } from "../page";
import useModal from "@/hook/useModal";
import { api } from "@/utils/api";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import {
  Pagination,
  PaginationWrapper,
} from "@/components/pagination/pagination";
import useDebounce from "@/hook/useDebounce";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const AuthorModal = dynamic(() => import("@/components/modals/AuthorModal"));
const ConfirmModal = dynamic(() => import("@/components/modals/ConfirmModal"));

const AuthorPage: NextPageWithLayout = () => {
  const utils = api.useContext();
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { open: openAuthorModal, handleOpen: handleOpenAuthorModal } =
    useModal();
  const { open: openConfirmModal, handleOpen: handleOpenConfirmModal } =
    useModal();
  const [currentItem, setCurrentItem] = useState<TACGIA | null>(null);
  const [searchValueDebounced, setSearchValueDebounced] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debounced = useDebounce({ value: searchValue, delay: 500 });
  const { data, isLoading, isFetching } = api.author.getWithPagination.useQuery(
    {
      limit: 10,
      page: pageIndex + 1,
      searchValue: searchValueDebounced,
    }
  );

  const { mutate: deleteAuthor } = api.author.delete.useMutation({
    async onSuccess() {
      setCurrentItem(null);
      if (data?.datas.length === 1 && pageIndex !== 0) {
        setPageIndex((p) => p - 1);
      } else {
        await utils.author.getWithPagination.refetch();
      }
      toast.success("Xóa thành công");
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleConfirmDelete = () => {
    currentItem && deleteAuthor({ MaTG: currentItem.MaTG });
  };

  useEffect(() => {
    setSearchValueDebounced(searchValue);
    setPageIndex(0);
  }, [debounced]);

  return (
    <>
      <Head>
        <title>Quản lý tác giả</title>
      </Head>

      <div className="mb-8 mt-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Danh sách tác giả
            </Typography>
            <Button
              variant="outlined"
              className="bg-white"
              onClick={() => handleOpenAuthorModal()}
            >
              Thêm tác giả
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
                  {["ID", "Tên", "Thao tác"].map((head) => (
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
                  data.datas.map(({ MaTG, TenTG }, index) => {
                    const isLast = index === data.datas.length - 1;
                    const className = isLast
                      ? "p-4 "
                      : "p-4 border-b border-blue-gray-50";
                    return (
                      <tr key={MaTG}>
                        <td className={`${className}`}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {MaTG}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {TenTG}
                          </Typography>
                        </td>

                        <td className={`${className} w-2/12`}>
                          <div className="flex w-max">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => {
                                setCurrentItem({ MaTG, TenTG });
                                handleOpenAuthorModal(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => {
                                setCurrentItem({ MaTG, TenTG });
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

      <AuthorModal
        open={openAuthorModal}
        handleOpen={handleOpenAuthorModal}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
      <ConfirmModal
        open={openConfirmModal}
        handleOpen={handleOpenConfirmModal}
        title="Xóa tác giả"
        content="Tác giả này và những đầu sách thuộc tác giả đó sẽ hoàn toàn bị xóa khỏi cơ sở dữ liệu. Bạn có muốn xóa?"
        cb={handleConfirmDelete}
      />
    </>
  );
};
AuthorPage.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default AuthorPage;
