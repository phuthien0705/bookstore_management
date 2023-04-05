import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";
import { type NextPageWithLayout } from "../page";

const BookEntryTicket: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>BookEntryTicket</title>
      </Head>
      <div>this is book entry ticket page</div>
    </>
  );
};
BookEntryTicket.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default BookEntryTicket;
