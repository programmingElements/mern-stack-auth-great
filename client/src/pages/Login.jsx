import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router';
import { AppContext } from '../context/AppContext';
import { registerUser, loginUser } from "../services/user.services.js";
import {toast} from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const {setIsLoggedIn, getUserDetails} = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const register = async () => {
    try {
        const {data} = await registerUser({name, email, password});
        if (data.success) {
            setIsLoggedIn(true);
            getUserDetails();
            navigate("/");
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
  }

  const login = async () => {
    try {
        const {data} = await loginUser({email, password});
        if (data.success) {
            setIsLoggedIn(true);
            getUserDetails();
            navigate("/");
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
  }

  const onSubmitHandler = (e) => {
    try {
        e.preventDefault();
        if (state === "Sign Up") {
            register();
        } else {
            login();
        }
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
  }

  

  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
        <img onClick={() => navigate("/")} src={assets.Logo} alt="Logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
            <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sign Up" ? "Create Account" : "Login"}</h2>
            <p className='text-center text-sm mb-6'>{state === "Sign Up" ? "Create your account" : "Login to your account"}</p>
            <form onSubmit={onSubmitHandler}>
                {
                    state === "Sign Up" && (
                    <div id='FullName' className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <span className="bi bi-person text-white"></span>
                        <input className='bg-transparent outline-none' type="text" placeholder='Full Name' onChange={(e) => setName(e.target.value)} value={name} required />
                    </div>
                    )
                }
                <div id='Email' className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <span className="bi bi-envelope text-white"></span>
                    <input className='bg-transparent outline-none' type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                <div id='Password' className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <span className="bi bi-lock text-white"></span>
                    <input className='bg-transparent outline-none' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                </div>
                <p onClick={() => navigate("/reset-password")} className='mb-4 text-indigo-500 cursor-pointer'>
                    Forgot password?
                </p>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
            </form>
            {
                state === "Sign Up" ? (
                    <p className='text-gray-400 text-center text-xs mt-4'>
                Already have an account? {' '}
                <span onClick={() => setState("Login")} className='text-blue-400 cursor-pointer underline'>Login here</span>
            </p>
                ) : (
                    <p className='text-gray-400 text-center text-xs mt-4'>
                    Don't have an account? {' '}
                    <span onClick={() => setState("Sign Up")} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
                </p>
                )
            }
        </div>
    </div>
  )
}

export default Login