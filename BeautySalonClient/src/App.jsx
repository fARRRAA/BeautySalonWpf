import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header/Header'
import { HomePage } from './pages/HomePage/HomePage'
import { Footer } from './components/Footer/Footer'
import { ServicePage } from './pages/ServicesPage/ServicePage'
import { TopHeader } from './components/TopHeader/TopHeader'
import { AboutUs } from './pages/AboutUs/AboutUs'
import { Contacts } from './pages/Contacts/Contacts'
import { Login } from './pages/Login/Login'
import { Profile } from './pages/Profile/Profile'
import { Register } from './pages/Register/Register'
import { Appointment } from './pages/Appointment/Appointment'

export function App() {

  return (
    <>
        <TopHeader/>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/services" element={<ServicePage/>}/>
          <Route path="/about" element={<AboutUs/>}/>
          <Route path="/contacts" element={<Contacts/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/user/profile" element={<Profile/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/book" element={<Appointment/>}/>
        </Routes>
        <Footer/>
    </>
  )
}


