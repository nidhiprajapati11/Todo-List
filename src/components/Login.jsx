import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleButton from "react-google-button";
import InputTodo from "./InputTodo";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [value, setUser] = useState(""); // State to manage user login status

  // Function to handle Google login
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  // Render the login form or InputTodo based on user login status
  return (
    <div>
      {value ? (
        <InputTodo />
      ) : (
        <div className="min-h-screen  mx-auto text-center w-full flex justify-center items-center">
          <div className="flex items-center justify-center h-screen  px-5 sm:px-0">
            <div className="flex bg-white rounded-sm shadow-lg overflow-hidden max-w-sm lg:max-w-4xl w-full">
              <div className="w-full p-8 ">
                <p className="text-xl text-center font-bold capitalize ">
                  Welcome back!
                </p>
                <div className="mt-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <label className="block  text-sm mb-2">Email</label>
                  </div>
                  <input
                    className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                    type="email"
                    required
                  />
                </div>
                <div className="mt-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <label className="block  text-sm mb-2">Password</label>
                  </div>
                  <input
                    className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                    type="password"
                  />
                  <a
                    href="#"
                    className="text-xs text-blue-500 hover:text-gray-900 text-end w-full mt-2"
                  >
                    Forget Password ?
                  </a>
                </div>
                <div className="mt-8">
                  <button className="bg-blue-600 text-white font-bold py-1 px-4 w-full rounded hover:bg-blue-600">
                    Login
                  </button>
                </div>
                <a
                  href="#"
                  className=" flex items-center justify-center mt-4 text-black border border-gray-300 rounded  py-2"
                >
                  <div className="flex justify-center w-full">
                    <div
                      className="flex w-full justify-center align-center items-center gap-3"
                      onClick={handleLogin}
                    >
                      <FcGoogle />
                      <span>Sign in with Google</span>
                    </div>
                  </div>
                </a>
                <div className="mt-4 flex items-center w-full text-center">
                  <a
                    href="#"
                    className="text-xs text-gray-500 capitalize text-center w-full"
                  >
                    Don&apos;t have any account yet?
                    <span className="text-blue-700"> Sign Up</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
