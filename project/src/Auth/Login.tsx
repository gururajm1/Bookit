import React from "react";
import pakka from "../assets/pakka.jpg";

const Login = () => {
  return (
    <div className="w-full h-screen flex">
      <div className="grid grid-cols-1 md:grid-cols-2 m-auto h-[550px] shadow-lg shadow-black-200 sm:max-w-[900px]">
        <div className="w-full h-[550px] hidden md:block">
          <img className="w-full h-full object-cover" src={pakka} alt="Login background" />
        </div>
        <div className="p-4 flex flex-col justify-around">
          <form>
            <h2 className="text-4xl font-bold text-center mb-9 text-gray-600">Login</h2>
            <div className="ml-8">
              <input className="border p-2 mr-2 mb-4 w-80 ml-2" type="text" placeholder="Your Email Address" />
              <input className="border p-2 mb-4 w-80 ml-2" type="password" placeholder="Enter Password" />
            </div>
            <button className="w-[350px] ml-6 p-2 my-4 bg-green-600 hover:bg-yellow-500 mt-7" type="submit">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
