import Head from "next/head";
import DashboardLayout from "@/layouts/dashboard";

function SettingPage() {
  return (
    <>
      <Head>
        <title>Config</title>
      </Head>
      <DashboardLayout>this is setting</DashboardLayout>
    </>
  );
}

export default SettingPage;
