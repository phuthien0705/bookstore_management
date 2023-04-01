import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";

function AuthorPage() {
  return (
    <>
      <Head>
        <title>AuthorManagement</title>
      </Head>
      <DashboardLayout>this is author page</DashboardLayout>
    </>
  );
}

export default AuthorPage;
