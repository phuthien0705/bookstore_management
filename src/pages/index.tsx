/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import AuthLayout from "@/layouts/auth";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  const [values, setValues] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const router = useRouter();
  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });
      if (result && result.ok) {
        void router.push({ pathname: "/dashboard/book" });
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const { value, name } = e.currentTarget;
    setValues((pre) => ({ ...pre, [name]: value }));
  };
  return (
    <AuthLayout>
      <img
        alt="bg"
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <form onSubmit={onSubmit} className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Username"
              size="lg"
              name="username"
              value={values.username}
              onChange={onChange}
            />
            <Input
              type="password"
              label="Password"
              size="lg"
              name="password"
              value={values.password}
              onChange={onChange}
            />
            <div className="-ml-2.5">
              <Checkbox label="Remember Me" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button type="submit" variant="gradient" fullWidth>
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </form>
    </AuthLayout>
  );
};

export default Login;
