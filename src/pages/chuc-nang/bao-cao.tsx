import DashboardLayout from "@/layouts/dashboard";
import {
  Spinner,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { type NextPageWithLayout } from "../page";

const BookLeftPanel = dynamic(() => import("@/content/bao-cao/BookLeftPanel"), {
  ssr: false,
  loading: () => (
    <div className="flex w-full items-center justify-between">
      <Spinner className="h-10 w-10" />
    </div>
  ),
});

const UserDebtPanel = dynamic(() => import("@/content/bao-cao/UserDebtPanel"), {
  ssr: false,
  loading: () => (
    <div className="flex w-full items-center justify-between">
      <Spinner className="h-10 w-10" />
    </div>
  ),
});

const tabs: { label: string; value: number; component: React.ReactElement }[] =
  [
    {
      label: "Báo cáo tồn",
      value: 1,
      component: <BookLeftPanel />,
    },
    {
      label: "Báo cáo công nợ",
      value: 2,
      component: <UserDebtPanel />,
    },
  ];

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Quản lý đầu sách</title>
      </Head>
      <Tabs value={1} className={`mt-4`}>
        <TabsHeader className={`w-fit`}>
          {tabs.map(({ label, value }) => (
            <Tab key={value} value={value} className={`w-fit`}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {tabs.map(({ value, component }) => (
            <TabPanel key={value} value={value} className={`p-0`}>
              {component}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
