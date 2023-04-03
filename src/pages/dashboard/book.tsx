import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";

const BookPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>BookManagement</title>
      </Head>
      <div>this is book</div>
    </>
  );
};
BookPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default BookPage;
