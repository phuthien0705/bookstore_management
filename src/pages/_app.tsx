import { MaterialTailwindControllerProvider } from "@/context";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { ThemeProvider } from "@material-tailwind/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps, type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { type NextPageWithLayout } from "./page";

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
          <Toaster
            containerStyle={{
              zIndex: 10000000,
            }}
            position={"top-right"}
            toastOptions={{
              style: {
                zIndex: 10000000,
              },
            }}
          />
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
