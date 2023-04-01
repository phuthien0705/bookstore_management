import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";

function CategoryPage() {
  return (
    <>
      <Head>
        <title>CategoryManagement</title>
      </Head>
      <DashboardLayout>this is category</DashboardLayout>
    </>
  );
}

export default CategoryPage;
