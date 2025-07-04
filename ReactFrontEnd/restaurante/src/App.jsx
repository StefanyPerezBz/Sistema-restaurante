import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Login from './pages/Login'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Cashier from './pages/cashier/Cashier'
import Chef from './pages/chef/Chef'
import Manager from './pages/manager/Manager'
import Waiter from './pages/waiter/Waiter'
import OnlyManagerPrivateRoute from './components/OnlyManagerPrivateRoute'
import ResetPassword from './pages/ResetPassword';
import FoodMenu from './pages/chef/foodManagement/FoodMenu';
import DefaultUpdateProfile from './pages/DefaultUpdateProfile'
import UserFeedback from './pages/user/UserFeedback'
//import { Link } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/feedback" element={<UserFeedback/>} />

        <Route element={<PrivateRoute/>}>
          <Route path="/cashier" element={<Cashier/>}/>
          <Route path="/chef" element={<Chef/>}/>
          <Route path="/chef/foodMenu" element={<FoodMenu/>}/>
          
          <Route path="/waiter" element={<Waiter/>}/>
          <Route path="/dashboard" element={<Dashboard/>} />
        </Route>

        <Route element={<OnlyManagerPrivateRoute/>}>
        <Route path="/manager" element={<Manager/>}/>
        </Route>

        <Route path="/about" element={<About/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/resetPassword" element={<ResetPassword/>} />
        <Route path="/updateProfile" element={<DefaultUpdateProfile/>} />
      </Routes>
    </BrowserRouter>
  )
}

 