"use client";

import Input from "@/Components/Input";
import { useCallback, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import GoogleSignInButton from "@/Components/googleSignInButton";
import Image from "next/image";
import { userRegistrationSchema, userLoginSchema } from "@/lib/validation";
import { z } from "zod";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [variant, setVariant] = useState("login");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  //to toggle between login page and register page
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  // login for existing user
  const login = useCallback(async () => {
    // if (!email || !password) {
    //   alert("Please provide both email and password.");
    //   return;
    // }
    // setIsLoading(true); // Start loading

    try {
      setErrors({});
      const validated = userLoginSchema.parse({ email, password });

      await signIn("credentials", {
        // email,
        // password,
        // callbackUrl: "/profiles",
        email: validated.email,
        password: validated.password,
        callbackUrl: "/profiles",
      });
    } catch (error) {
      // alert("An unexpected error occurred.");
      // console.error("Login error:", error);

      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        alert("An unexpected error occurred.");
        console.error("Login error:", error);
      }
    }
    // finally {
    //   setIsLoading(false); // Stop loading
    // }
  }, [email, password]);

  //register a new user
  const register = useCallback(async () => {
    // if (!email || !name || !password) {
    //   alert("Please fill out all fields.");
    //   return;
    // }
    try {
      setErrors({});
      const validated = userRegistrationSchema.parse({ name, email, password });

      const response = await axios.post("/api/register", validated);
      console.log("Registration successful:", response.data);

      login();

      // const response = await axios.post("/api/register", {
      //   email,
      //   name,
      //   password,
      // });
      // console.log("Registration successful:", response.data);
      // login(); // Log in the user after registering
    } catch (error) {
      // if (axios.isAxiosError(error) && error.response?.status === 422) {
      //   alert(error.response.data.error); // Handle "Email taken"
      // } else {
      //   console.error(
      //     "Unexpected error:",
      //     axios.isAxiosError(error)
      //       ? error.response?.data || error.message
      //       : error
      //   );
      //   alert("An unexpected error occurred. Please try again.");
      // }
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(error) && error.response?.status === 422) {
        alert(error.response.data.error);
      } else {
        console.error("Register error:", error);
        alert("An unexpected error occurred.");
      }
    }
  }, [email, name, password, login]);

  return (
    <div className="relative w-full h-screen bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-cover">
      {/* Dark overlay */}
      <div className='absolute inset-0 bg-black/60 z-0' />

      {/* Logo */}
      <div className='absolute top-6 left-6 z-10'>
        <Image
          src='/images/logo.jpg'
          alt='Logo'
          width={120}
          height={40}
          className='w-32 h-auto'
          priority
        />
      </div>

      {/* Auth Form */}
      <div className='relative z-10 flex justify-center items-center h-full px-4'>
        <div className='bg-black bg-opacity-75 backdrop-blur-sm px-6 py-8 rounded-xl shadow-xl w-full max-w-xs text-white animate-fade-in'>
          <h2 className='text-3xl md:text-4xl font-semibold mb-4 text-center'>
            {variant === "login" ? "Sign In" : "Create an Account"}
          </h2>

          <div className='flex flex-col w-full'>
            {variant === "register" && (
              <>
                <Input
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                    setName(ev.target.value)
                  }
                  value={name}
                  id='name'
                  type='text'
                  placeholder='Your Name'
                  className='w-full'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name}</p>
                )}
              </>
            )}

            <Input
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(ev.target.value)
              }
              value={email}
              id='email'
              type='email'
              placeholder='Email Address'
              className='w-full'
            />
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email}</p>
            )}

            <Input
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(ev.target.value)
              }
              value={password}
              id='password'
              type='password'
              placeholder='Password'
              className='w-full'
            />
            {errors.password && <p className="text-red-500 text-sm ">{errors.password}</p>}

            <button
              onClick={variant === "login" ? login : register}
              className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-300'
            >
              {variant === "login" ? "Login" : "Register"}
            </button>

            <div className='flex items-center justify-center mt-6 w-full'>
              <GoogleSignInButton className='w-full rounded-lg' />
            </div>
          </div>

          {/* {variant === "login" && (
            <div className='flex justify-between items-center text-sm text-gray-400 mt-6'>
              <label className='flex items-center space-x-2'>
                <input type='checkbox' className='accent-red-600' />
                <span>Remember me</span>
              </label>
              <a href='#' className='hover:underline'>
                Need help?
              </a>
            </div>
          )} */}

          <p className='text-sm text-gray-400 mt-8 text-center'>
            {variant === "login"
              ? "New to ShowFlix?"
              : "Already have an account?"}{" "}
            <span
              onClick={toggleVariant}
              className='text-white hover:underline cursor-pointer font-medium'
            >
              {variant === "login" ? "Sign up now" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Auth;

