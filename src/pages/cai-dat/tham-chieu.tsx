import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";
import { Card, CardBody, CardHeader, Checkbox, Input, Typography, Button } from "@material-tailwind/react";

const SettingPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Thay đổi tham chiếu</title>
      </Head>
      <div className="mb-8 mt-12">
      <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Nhập sách
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-row gap-10">
            <Input variant="outlined" label="Số lượng nhập tối thiểu"/>
            <Input variant="outlined" label="Số lượng tồn tối đa"/>
          </CardBody>
        </Card>
        <Card className="mt-10">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 flex items-center justify-between px-6 py-4"
          >
            <Typography variant="h6" color="white">
              Bán sách
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-row gap-10">
            <div className="flex flex-col gap-6" style={{width: "100%"}}>
                <Input variant="outlined" label="Số tiền nợ tối đa"/>
                <Input variant="outlined" label="Tỷ lệ đơn giá bán"/>
            </div>
            <div className="flex flex-col gap-6" style={{width: "100%"}}>
              <Input variant="outlined" label="Tồn tối thiểu sau bán"/>
            </div>
          </CardBody>
        </Card>
        <div className="flex justify-end mt-8">
          <Checkbox label={
            <Typography color="blue-gray" className="font-medium flex">Sử dụng
              <Typography as="a" href="#" color="blue" className="font-medium hover:text-blue-700 transition-colors mr-5">
                &nbsp;quy định này.
              </Typography>
            </Typography>
          } />
          <Button color="gray" className="mr-4">
            Mặc định
          </Button>
          <Button color="blue">
            Áp dụng
          </Button>
        </div>
      </div>
    </>
  );
};
SettingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default SettingPage;
