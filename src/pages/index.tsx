/* eslint-disable @next/next/no-img-element */
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { type NextPageWithLayout } from "./page";
import AuthLayout from "@/layouts/auth";

const Login: NextPageWithLayout = () => {
  const router = useRouter();
  const [values, setValues] = useState<{
    TenDangNhap: string;
    MatKhau: string;
  }>({ TenDangNhap: "", MatKhau: "" });
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        TenDangNhap: values.TenDangNhap,
        MatKhau: values.MatKhau,
      });
      if (result && result.ok) {
        void router.push({ pathname: "/chuc-nang/phieu-nhap-sach" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Tài khoản hoặc mật khẩu không đúng!");
    }
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget;
    setValues((pre) => ({ ...pre, [name]: value }));
  };
  return (
    <div>
      <img
        alt="bg"
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <form onSubmit={onSubmit} className="container mx-auto p-4">
        <Card className="absolute left-2/4 top-2/4 w-full max-w-[24rem] -translate-x-2/4 -translate-y-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Đăng nhập
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Tên đăng nhập"
              size="lg"
              name="TenDangNhap"
              value={values.TenDangNhap}
              onChange={onChange}
              required
            />
            <div className="relative flex w-full max-w-[24rem]">
              <Input
                label="Mật khẩu"
                size="lg"
                type={showPassword ? "text" : "password"}
                name="MatKhau"
                value={values.MatKhau}
                onChange={onChange}
                required
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <div className="!absolute right-1 rounded" style={{ top: "5px" }}>
                <IconButton
                  onClick={() => setShowPassword((p) => !p)}
                  variant="text"
                  color="blue-gray"
                  size="sm"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </IconButton>
              </div>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button type="submit" variant="gradient" fullWidth>
              Đăng nhập
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
Login.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
export default Login;
