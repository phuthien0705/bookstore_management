import { type AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import { api } from "@/utils/api";
import { type NextPageWithLayout } from "./page";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

type Props = AppProps & {
  Component: NextPageWithLayout;
};
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: Props) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <>{getLayout(<Component {...pageProps} />)}</>
          <Toaster position="bottom-center" />
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
