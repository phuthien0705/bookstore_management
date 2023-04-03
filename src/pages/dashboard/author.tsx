import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "@/layouts/dashboard";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { type NextPageWithLayout } from "../page";
import { type Author } from "@prisma/client";
import { api } from "@/utils/api";
const AuthorModal = dynamic(() => import("@/components/modals/AuthorModal"));

const AuthorPage: NextPageWithLayout = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Author | null>(null);
  const handleOpen = () => setOpenModal((cur) => !cur);
  const { data, isLoading, isFetching } = api.author.getAll.useQuery();
  // console.log({ data, isLoading, isFetching });
  const utils = api.useContext();
  const { mutate: deleteAuthor } = api.author.delete.useMutation({
    async onSuccess(data: any) {
      toast.success("Delete successfully");
      await utils.author.getAll.refetch();
    },
    onError(err) {
      console.error(err);
      handleOpen();
    },
  });

  return (
    <>
      <Head>
        <title>AuthorManagement</title>
      </Head>
      <>
        <div className="mt-12 mb-8">
          <Card>
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-8 flex items-center justify-between px-6 py-4"
            >
              <Typography variant="h6" color="white">
                Authors Table
              </Typography>
              <Button
                variant="outlined"
                className="bg-white"
                onClick={handleOpen}
              >
                Add Author
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
                    data.map(({ id, name }) => {
                      const className = `py-3 px-5`;
                      return (
                        <tr key={id}>
                          <td className={className}>
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
                                  setOpenModal(true);
                                }}
                                className="cursor-pointer text-xs font-semibold text-blue-gray-600"
                              >
                                Edit
                              </Typography>
                              <Typography
                                onClick={() => deleteAuthor({ id })}
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
            </CardBody>
          </Card>
        </div>
      </>
      <AuthorModal
        open={openModal}
        handleOpen={handleOpen}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
    </>
  );
};
AuthorPage.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default AuthorPage;
