import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../../screens/home/Home'
import Login from '../../screens/login/Login'

const RouterConfig = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='login' element={<Login/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default RouterConfig