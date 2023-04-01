export function AuthLayout(props: { children: React.ReactNode }) {
  return <div className="relative min-h-screen w-full">{props.children}</div>;
}

export default AuthLayout;
