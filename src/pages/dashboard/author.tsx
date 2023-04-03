import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Typography,
} from "@material-tailwind/react";
import { authorsTableData } from "@/data";
import { useState } from "react";
import { AuthorModal } from "@/components/modals/AuthorModal";
import { api } from "@/utils/api";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

function AuthorPage() {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal((cur) => !cur);

  const { data, isLoading, isFetching } = api.author.getAll.useQuery();
  console.log({ data, isLoading, isFetching });
  return (
    <>
      <Head>
        <title>AuthorManagement</title>
      </Head>
      <DashboardLayout>
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
                    data.map(({ id, name }, key) => {
                      const className = `py-3 px-5 ${
                        key === authorsTableData.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

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

                          <td className={className}>
                            <Typography
                              as="a"
                              href="#"
                              className="text-xs font-semibold text-blue-gray-600"
                            >
                              Edit
                            </Typography>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </DashboardLayout>
      <AuthorModal open={openModal} handleOpen={handleOpen} />
    </>
  );
}

export default AuthorPage;
