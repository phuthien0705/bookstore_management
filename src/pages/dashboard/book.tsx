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
import { type Book } from "@prisma/client";
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
  const [currentItem, setCurrentItem] = useState<Book | null>(null);
  const {
    data,
    isLoading: isBooksLoading,
    isFetching,
  } = api.book.getWithPagination.useQuery({
    limit: 10,
    page: pageIndex + 1,
  });
  const { data: authors, isLoading: isAuthorsLoading } =
    api.author.getAll.useQuery();
  const { data: categorys, isLoading: isCategorysLoading } =
    api.category.getAll.useQuery();
  const { mutate: deleteBook } = api.book.delete.useMutation({
    async onSuccess() {
      setCurrentItem(null);
      if (data?.datas.length === 1 && pageIndex !== 0) {
        setPageIndex((p) => p - 1);
      } else {
        await utils.author.getWithPagination.refetch();
      }
      toast.success("Delete successfully");
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleConfirmDelete = () => {
    currentItem && deleteBook({ id: currentItem.id });
  };
  console.log(data);

  const isLoading = isAuthorsLoading && isBooksLoading && isCategorysLoading;
  const renderAuthor = (id: number) => {
    const result = authors && authors.find((obj) => obj.id === id);
    return result ? result.name : undefined;
  };
  const renderCategory = (id: number) => {
    const result = categorys && categorys.find((obj) => obj.id === id);
    return result ? result.name : undefined;
  };
  return (
    <>
      <Head>
        <title>BookManagement</title>
      </Head>
      <div className="mt-12 mb-8">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-8 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Books Table
            </Typography>
            <Button
              variant="outlined"
              className="bg-white"
              onClick={() => handleOpenBookModal()}
            >
              Add Author
            </Button>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "ID",
                    "title",
                    "price",
                    "quantity",
                    "author",
                    "category",
                    "action",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
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
                      <tr key={item.id}>
                        <td className={`${className} w-1/12`}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.id}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.title}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.price}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.quantity}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.authorId && renderAuthor(item.authorId)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {item.categoryId && renderCategory(item.categoryId)}
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
