import { useSession } from "next-auth/react";
import { Sidenav, DashboardNavbar } from "@/components/layout";
import { useMaterialTailwindController } from "@/context";
import { routes } from "@/constant/routes";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function DashboardLayout(props: { children: React.ReactNode }) {
  const router = useRouter();
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { data: sessionData, status } = useSession();

  useEffect(() => {
    if (!sessionData) {
      void router.push({
        pathname: "/login",
      });
    }
  }, [router, sessionData]);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav routes={routes} />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        {props.children}
      </div>
    </div>
  );
}

export default DashboardLayout;
