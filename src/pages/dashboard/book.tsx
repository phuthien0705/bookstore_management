import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";

function BookPage() {
  return (
    <>
      <Head>
        <title>BookManagement</title>
      </Head>
      <DashboardLayout>this is book</DashboardLayout>
    </>
  );
}

export default BookPage;
