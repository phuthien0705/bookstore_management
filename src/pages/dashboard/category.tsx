import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { type Category } from "@prisma/client";
import { api } from "@/utils/api";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
} from "@material-tailwind/react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import {
  Pagination,
  PaginationWrapper,
} from "@/components/pagination/pagination";
import useModal from "@/hook/useModal";

const ConfirmModal = dynamic(() => import("@/components/modals/ConfirmModal"));
const CategoryModal = dynamic(
  () => import("@/components/modals/CategoryModal")
);

const CategoryPage: NextPageWithLayout = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const { open: openAuthorModal, handleOpen: handleOpenCategoryModal } =
    useModal();
  const { open: openConfirmModal, handleOpen: handleOpenConfirmModal } =
    useModal();
  const [currentItem, setCurrentItem] = useState<Category | null>(null);
  const utils = api.useContext();
  const { data, isLoading, isFetching } =
    api.category.getWithPagination.useQuery({
      limit: 10,
      page: pageIndex + 1,
    });
  const { mutate: deleteCategory } = api.category.delete.useMutation({
    async onSuccess() {
      setCurrentItem(null);
      if (data?.datas.length === 1 && pageIndex !== 0) {
        setPageIndex((p) => p - 1);
      } else {
        await utils.category.getWithPagination.refetch();
      }
      toast.success("Delete successfully");
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleConfirmDelete = () => {
    currentItem && deleteCategory({ id: currentItem.id });
  };

  return (
    <>
      <Head>
        <title>CategoryManagement</title>
      </Head>
      <div className="mt-12 mb-8">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-8 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Category Table
            </Typography>
            <Button
              variant="outlined"
              className="bg-white"
              onClick={() => handleOpenCategoryModal()}
            >
              Add Category
            </Button>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["ID", "Name", "action"].map((el) => (
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
                  data.datas.map(({ id, name }) => {
                    const className = `py-3 px-5`;
                    return (
                      <tr key={id}>
                        <td className={`${className} w-1/12`}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {id}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {name}
                          </Typography>
                        </td>

                        <td className={`${className} w-2/12`}>
                          <div className="flex gap-3">
                            <Typography
                              onClick={() => {
                                setCurrentItem({ id, name });
                                handleOpenCategoryModal(true);
                              }}
                              className="cursor-pointer text-xs font-semibold text-blue-gray-600"
                            >
                              Edit
                            </Typography>
                            <Typography
                              onClick={() => {
                                setCurrentItem({ id, name });
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
      <CategoryModal
        open={openAuthorModal}
        handleOpen={handleOpenCategoryModal}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
      <ConfirmModal
        open={openConfirmModal}
        handleOpen={handleOpenConfirmModal}
        title="Delete Category"
        content="The category will be permanently deleted. You are sure you want to delete?"
        cb={handleConfirmDelete}
      />
    </>
  );
};
CategoryPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default CategoryPage;
