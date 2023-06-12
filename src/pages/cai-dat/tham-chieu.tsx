import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";

const SettingPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Thay đổi tham chiếu</title>
      </Head>
      <div>this is setting</div>
    </>
  );
};
SettingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default SettingPage;
