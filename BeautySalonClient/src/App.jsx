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
import { Cart } from './pages/Cart/Cart'
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUser } from './store/slices/userSlice';
import { useEffect } from 'react'
import { useCartActions } from './hooks/useCartAction';
import { NotFound } from './pages/NotFound/NotFound'
import { Catalog } from './pages/ServicesPage/Catalog/Catalog'
export function App() {
  const { fetchUserCart } = useCartActions();
  const dispatch = useDispatch();
  useEffect(() => {
    async function useInitUserFromCookie() {
      const userCookie = Cookies.get('user');
      console.log(userCookie);
      if (userCookie) {
        const user = JSON.parse(userCookie);
        dispatch(setUser({
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailConfirmed: user.isEmailConfirmed
        }));
        if (user && user.id) {
          fetchUserCart(user.id);
        }
      }
    }
    useInitUserFromCookie();
  }, []);

  return (
    <>
      <TopHeader />
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/shop" element={<Catalog />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<Appointment />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}


