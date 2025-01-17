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

createRoot(document.getElementById('root')).render(
  <AppProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
      <Route index path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="email-verify" element={<EmailVerify />} />
      <Route path="reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  </BrowserRouter>
  </AppProvider>,
)
