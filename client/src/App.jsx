import React from 'react';
import { Outlet } from "react-router";
import {ToastContainer} from "react-toastify";
import "react-toastify/ReactToastify.css";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Outlet />
    </div>
  )
}

export default App