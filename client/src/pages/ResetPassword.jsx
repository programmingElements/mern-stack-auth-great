import React, {useState} from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router';

const ResetPassword = () => {
  const inputRefs = React.useRef([]);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const navigate = useNavigate();
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

  const onSubmitEmail = async (e) => {
    try {
        e.preventDefault();
        
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
  }

  return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
          <img onClick={() => navigate("/")} src={assets.Logo} alt="Logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
          
          {/* enter email id */}
          
          {
            !isEmailSent && (
                <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center text-indigo-300 mb-6'>Enter your registered email address.</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <span className='bi bi-envelope w-3 text-white'></span>
            <input type="email" placeholder='Email id' className='bg-transparent outline-none text-white' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mt-3'>Submit</button>
          </form>
            )
          }

          {/* otp input form */}
          { !isOtpSubmitted && isEmailSent && (
            <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'> 
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset password OTP</h1>
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
            <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>Submit</button>
        </form>
          ) }
          

              {/* enter new password */}
              { isOtpSubmitted && isEmailSent && (
                <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
                <p className='text-center text-indigo-300 mb-6'>Enter the new password below</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                  <span className='bi bi-lock w-3 text-white'></span>
                  <input type="password" placeholder='Password' className='bg-transparent outline-none text-white' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mt-3'>Submit</button>
                </form>
              )}
              
      </div>
    )
}

export default ResetPassword