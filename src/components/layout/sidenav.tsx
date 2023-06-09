/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Link from "next/link";
import { useRouter } from "next/router";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useContext } from "react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { DashboardContext } from "@/layouts/dashboard";

interface ISidenav {
  brandImg?: string;
  brandName?: string;
  managerRoutes: any[];
  staffRoutes: any[];
}

export function Sidenav({
  brandImg = "",
  brandName = "Quản lý nhà sách",
  managerRoutes,
  staffRoutes,
}: ISidenav) {
  const router = useRouter();
  const { isManager } = useContext(DashboardContext);
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-blue-gray-800 to-blue-gray-900",
    white: "bg-white shadow-lg",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${
        sidenavTypes[sidenavType as unknown as keyof typeof sidenavTypes]
      } ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0`}
    >
      <div
        className={`relative border-b ${
          sidenavType === "dark" ? "border-white/20" : "border-blue-gray-50"
        }`}
      >
        <Link
          href="/chuc-nang/phieu-nhap-sach"
          className="flex items-center gap-4 px-8 py-6"
        >
          {/* <Avatar src={brandImg} size="sm" /> */}
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {(isManager ? managerRoutes : staffRoutes).map(
          (
            {
              layout,
              title,
              pages,
            }: { layout: string; title: string; pages: any[] },
            key
          ) => (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              {title && (
                <li className="mx-3.5 mb-2 mt-4">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-bold uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              )}
              {pages.map(
                ({
                  icon,
                  name,
                  path,
                }: {
                  icon: any;
                  name: string;
                  path: string;
                }) => {
                  const isActive = router.pathname === path;
                  return (
                    <li key={name}>
                      <Link href={`/${layout}${path}`}>
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            {name}
                          </Typography>
                        </Button>
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>
          )
        )}
      </div>
    </aside>
  );
}

export default Sidenav;
