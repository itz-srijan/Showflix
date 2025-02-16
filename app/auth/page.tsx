"use client";
import Input from "@/Components/Input";
import { useCallback, useState } from "react";
import axios from "axios";
// import { signIn } from "next-auth/react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [variant, setVariant] = useState("login");

  //to toggle between login page and register apge
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  //register a new user
  const register = useCallback(async () => {
    if (!email || !name || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/register", {
        email,
        name,
        password,
      });
      console.log("Registration successful:", response.data);
    } catch (error: any) {
      if (error.response?.status === 422) {
        alert(error.response.data.error); // Handle "Email taken"
      } else {
        console.error(
          "Unexpected error:",
          error.response?.data || error.message
        );
        alert("An unexpected error occurred. Please try again.");
      }
    }
  }, [email, name, password]);

  //login for existing user
  // const login = useCallback(async () => {
  //   try {
  //     await signIn('credentials', {
  //       email,
  //       password,
  //       redirect : false,
  //       callbackUrl: '/'
  //     })
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },[email,password]);

  return (
    <div className=" relative w-full h-screen bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-cover">
      <div className='bg-black w-full h-full md:bg-opacity-40'>
        <nav className='px-12 py-5'>
          <img src='/images/logo.jpg' alt='Logo' className='h-12' />
        </nav>

        <div className='flex justify-center items-center'>
          <div className='bg-black bg-opacity-70 px-16 py-16 md:p-12 rounded-lg shadow-lg max-w-md'>
            <h2 className='text-white text-3xl font-semibold mb-6 text-center'>
              {variant === "login" ? "Sign in" : "Register"}
            </h2>

            <div className='flex flex-col'>
              {variant === "register" && (
                <Input
                  onChange={(ev: any) => setName(ev.target.value)}
                  value={name}
                  id='name'
                  type='text'
                  placeholder='name'
                />
              )}
              <Input
                onChange={(ev: any) => setEmail(ev.target.value)}
                value={email}
                id='email'
                type='email'
                placeholder='write your email'
              />
              <Input
                onChange={(ev: any) => setPassword(ev.target.value)}
                value={password}
                id='password'
                type='password'
                placeholder='Password'
              />
              <button
                onClick={register}
                className='bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded'
              >
                {variant === "login" ? "Login" : "Register"}
              </button>
            </div>

            {variant === "login" && (
              <div className='flex justify-between text-gray-400 text-sm mt-4'>
                <label className='flex items-center space-x-1'>
                  <input type='checkbox' className='accent-red-600' />
                  <span>Remember me</span>
                </label>
                <a href='#' className='hover:underline'>
                  Need help?
                </a>
              </div>
            )}

            <p className='text-gray-400 mt-6 text-center'>
              {variant === "login"
                ? "New to Netflix?"
                : "Already have account?"}{" "}
              <span
                onClick={toggleVariant}
                className='text-white hover:underline'
              >
                {variant === "login" ? "Sign up" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Auth;
