/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

const Login: React.FC = () => {
  const [values, setValues] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const { data: sessionData, status } = useSession();
  console.log("sessionData", sessionData, status);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });
      if (result && result.ok) {
        console.log("login successful");
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
    <>
      {/* <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        </p>
        <button
          className="rounded-full bg-blue-400 bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-blue-500"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={sessionData ? void signOut() : () => handleLogin()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div> */}
      <form onSubmit={onSubmit} className="flex flex-col">
        <label>
          username
          <input
            className="ml-2 border border-solid border-black"
            value={values.username}
            onChange={onChange}
            name="username"
          />
        </label>
        <label>
          password
          <input
            className="ml-2 border border-solid border-black"
            value={values.password}
            onChange={onChange}
            name="password"
          />
        </label>
        <button type="submit">SignIn</button>
      </form>
    </>
  );
};

export default Login;
