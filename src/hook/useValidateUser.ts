import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserRole } from "@/constant/constant";

export default function useValidateUser() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") return;
    if (
      sessionData &&
      sessionData.user.NhomNguoiDung.TenNhom === UserRole.staff &&
      router
    ) {
      void router.push("/");
    }
  }, [router, sessionData, status]);
}
