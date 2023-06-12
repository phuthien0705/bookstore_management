import Head from "next/head";

export function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <div className="relative min-h-screen w-full">{props.children}</div>
    </>
  );
}

export default AuthLayout;
