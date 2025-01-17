import React, { useContext } from "react";
import { assets } from "../assets/assets";
import {useNavigate} from "react-router";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import {logoutUser, sendVerifyOtp} from "../services/user.services";

const Navbar = () => {
  const navigate = useNavigate();
  const {userData, setUserData, setIsLoggedIn} = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
        const {data} = await sendVerifyOtp();
        if (data.success) {
            navigate("/email-verify");
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
  }

  const logout = async () => {
    try {
        const {data} = await logoutUser();
        if (data.success) {
            setIsLoggedIn(false);
            setUserData(false);
            navigate('/');
        }
    } catch (error) {
        toast.error(error.message);
    }
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <div className="img-logo">
        <img src={assets.Logo} alt="Logo" className="w-28 sm:w-32" />
      </div>
      {
        userData ? (<div className="w-8 h-8 flex justify-center items-center bg-gray-800 text-white rounded-full group relative font-medium text-xl">
            {userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">

                <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                    {!userData.isAccountVerified && (<li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>)}
                    <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
                </ul>
                
            </div>
            </div>) : (<button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">Login<span className="bi bi-arrow-right"></span></button>)
      }
      
    </div>
  );
};

export default Navbar;
