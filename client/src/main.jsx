import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { BrowserRouter, Routes, Route } from 'react-router';
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppProvider } from './context/AppContext.jsx';
import AuthLayout from "./components/AuthLayout.jsx";

createRoot(document.getElementById('root')).render(
  <AppProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
      <Route index path="" element={<Home />} />
      <Route path="login" element={<AuthLayout authentication={false}><Login /></AuthLayout>} />
      <Route path="email-verify" element={<AuthLayout authentication><EmailVerify /></AuthLayout>} />
      <Route path="reset-password" element={<AuthLayout authentication={false}><ResetPassword /></AuthLayout>} />
      </Route>
    </Routes>
  </BrowserRouter>
  </AppProvider>,
)
