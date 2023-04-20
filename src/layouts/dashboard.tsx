import { useSession } from "next-auth/react";
import { Sidenav, DashboardNavbar } from "@/components/layout";
import { useMaterialTailwindController } from "@/context";
import { routes } from "@/constant/routes";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface IDashboardContext {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}
const dashboardContextDefaultValue: IDashboardContext = {
  searchValue: "",
  setSearchValue: () => undefined,
};
export const DashboardContext = createContext<IDashboardContext>(
  dashboardContextDefaultValue
);

export function DashboardLayout(props: { children: React.ReactNode }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { data: sessionData, status } = useSession();
  useEffect(() => {
    if (!sessionData && status !== "loading") {
      void router.push({
        pathname: "/",
      });
    }
  }, [router, sessionData, status]);

  return (
    <DashboardContext.Provider value={{ searchValue, setSearchValue }}>
      <div className="min-h-screen bg-blue-gray-50/50">
        <Sidenav routes={routes} />
        <div className="p-4 xl:ml-80">
          <DashboardNavbar />
          {props.children}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardLayout;
