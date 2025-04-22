import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header/Header'
import { HomePage } from './pages/HomePage/HomePage'
import { Footer } from './components/Footer/Footer'
import { ServicePage } from './pages/ServicesPage/ServicePage'
import { TopHeader } from './components/TopHeader/TopHeader'
import { AboutUs } from './pages/AboutUs/AboutUs'

export function App() {

  return (
    <>
        <TopHeader/>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/services" element={<ServicePage/>}/>
          <Route path="/about" element={<AboutUs/>}/>
        </Routes>
        <Footer/>
    </>
  )
}


