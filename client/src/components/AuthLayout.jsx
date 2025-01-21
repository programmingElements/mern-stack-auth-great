import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import AppContext from '../context/AppContext';

const Protected = ({children, authentication = true}) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const { isLoggedIn } = useContext(AppContext)

  useEffect(() => {
    if (authentication && isLoggedIn !== authentication) {
      navigate("/login");
    } else if (!authentication && isLoggedIn !== authentication) {
      navigate("/");
    } 
    setLoader(false);
  }, [isLoggedIn, authentication, navigate])

  return loader ? null : (
    <>{children}</>
  )
}

export default Protected