import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../../screens/home/Home'
import Login from '../../screens/login/Login'
import Signup from '../../screens/signup/Signup'
import Profile from '../../screens/profile/Profile'
import ForgotPassword from '../../screens/forgot/ForgotPassword'
import UserContextProvider from '../../context/UserContextProvider'

const RouterConfig = () => {
  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
              <Routes>
                  <Route path='/' element={<Login/>}/>
                  <Route path='signup' element={<Signup/>}/>
                  <Route path='forgot' element={<ForgotPassword/>}/>
                  <Route path='home' element={<Home/>}/>
                  <Route path='home/profile' element={<Profile/>}/>
              </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </>
  )
}

export default RouterConfig