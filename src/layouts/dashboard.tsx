import { useSession } from "next-auth/react";
import { useEffect, createContext, useState } from "react";
import { useRouter } from "next/router";
import { managerRoutes, staffRoutes } from "@/constant/routes";
import { Sidenav, DashboardNavbar } from "@/components/layout";
import { UserRole } from "@/constant/constant";

interface IDashboardContext {
  isManager: boolean;
}

export const DashboardContext = createContext<IDashboardContext>({
  isManager: false,
});

export function DashboardLayout(props: { children: React.ReactNode }) {
  const router = useRouter();
  const [isManager, setIsManager] = useState(false);
  const { data: sessionData, status } = useSession();
  useEffect(() => {
    if (status === "loading") return;
    if (!sessionData) {
      void router.push({
        pathname: "/",
      });
    }
    if (
      sessionData &&
      sessionData.user.NhomNguoiDung.TenNhom === UserRole.manager
    ) {
      setIsManager(true);
    } else {
      setIsManager(false);
    }
  }, [router, sessionData, status]);
  return (
    <DashboardContext.Provider value={{ isManager }}>
      <div className="min-h-screen bg-blue-gray-50/50">
        <Sidenav managerRoutes={managerRoutes} staffRoutes={staffRoutes} />
        <div className="p-4 xl:ml-80">
          <DashboardNavbar />
          {props.children}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardLayout;
