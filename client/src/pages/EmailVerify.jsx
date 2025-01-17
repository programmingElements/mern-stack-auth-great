import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router';
import { verifyAccount } from '../services/user.services';

const EmailVerify = () => {
  const inputRefs = React.useRef([]);
  const navigate = useNavigate();
  const {isLoggedIn, userData, getUserDetails} = useContext(AppContext);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index+1].focus();
    }
  }
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
        inputRefs.current[index - 1].focus();
    }
  }
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].value = char;
        }
    })
  }

  const handleSubmit = async (e) => {
    try {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        const otp = otpArray.join('');
        const {data} = await verifyAccount({otp: otp});
        if (data.success) {
            toast.success(data.message);
            getUserDetails();
            navigate("/")
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
  }

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
        navigate("/");
    }
  }, [isLoggedIn, userData])

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
        <img onClick={() => navigate("/")} src={assets.Logo} alt="Logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
        <form onSubmit={handleSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'> 
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
                <p className='text-center text-indigo-300 mb-6'>Enter the 6-digit code sent to your email id.</p>
                <div className="flex justify-between mb-8" onPaste={handlePaste}>
                    {
                        Array(6).fill(0).map((_,index) => {
                            return (
                                <input 
                                type='text' 
                                maxLength={1} 
                                key={index} 
                                ref={(e) => inputRefs.current[index] = e} 
                                onInput={(e) => handleInput(e,index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                required 
                                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                                />
                            )
                        })
                    }
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>Verify email</button>
            </form>
    </div>
  )
}

export default EmailVerify