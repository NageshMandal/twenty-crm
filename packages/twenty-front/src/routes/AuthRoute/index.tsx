import { lazy, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import ForgotPassPage from "../../pages/Auth/ForgotPass";
import LoginPage from "../../pages/Auth/LogIn";
import NewAccount from "../../pages/Auth/NewAccount";
import RestorePassPage from "../../pages/Auth/RestorePass";
import { paths } from "../path";

// const LoginPage = lazy(() => import("../../pages/Auth/LogIn"));
const SignUpPage = lazy(() => import("../../pages/Auth/SignUp"));
const CreateAccountPage = lazy(() => import("../../pages/Auth/CreateAccount"));
const newAccount = lazy(() => import("../../pages/Auth/NewAccount"));

const AboutRoute = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(paths.main.automation.index);
    }
  }, [token]);

  return (
    <div className='bg-bodyBgColor-dark'>
      <Routes>
        <Route path='login' element={<LoginPage />} />
        <Route path='forgot-pass' element={<ForgotPassPage />} />
        <Route path='restore-pass' element={<RestorePassPage />} />
        <Route path='signup' element={<SignUpPage />} />
        <Route path='new-account' element={<NewAccount />} />
        <Route path='create-account' element={<CreateAccountPage />} />
        <Route path='/*' element={<Navigate replace to='login' />} />
      </Routes>
    </div>
  );
};

export default AboutRoute;
