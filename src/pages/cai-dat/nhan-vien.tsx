import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";

const StaffPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Quản lý nhân viên</title>
      </Head>
      <div>this is settign page</div>
    </>
  );
};

StaffPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default StaffPage;
