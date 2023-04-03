import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";

const CategoryPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>CategoryManagement</title>
      </Head>
      <div>this is category</div>
    </>
  );
};
CategoryPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default CategoryPage;
