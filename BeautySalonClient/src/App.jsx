import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header/Header'
import { HomePage } from './pages/HomePage/HomePage'
import { Footer } from './components/Footer/Footer'

export function App() {

  return (
    <>
      <div className="topheader">

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1_71)">
            <path d="M15.9439 6.85256C14.1524 5.75248 13.9318 4.52356 13.9318 2.89863C13.9318 2.12924 14.1097 1.40147 14.4262 0.753858C14.1955 0.720451 13.9596 0.702881 13.7197 0.702881C11.0186 0.702881 8.82899 2.89249 8.82899 5.59355V10.7537C8.82899 11.528 8.20129 12.1557 7.42694 12.1557C6.65264 12.1557 6.0249 11.528 6.0249 10.7537V8.28702C4.35035 9.8718 3.30542 12.1152 3.30542 14.6028C3.30542 19.4046 7.19806 23.2973 11.9999 23.2973C16.8017 23.2973 20.6944 19.4046 20.6944 14.6028C20.6944 11.2209 18.7635 8.28998 15.944 6.85232" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.2501 12.8694L8.74951 19.3699" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="14.0016" cy="18.1215" r="0.702804" fill="white" />
            <circle cx="10.026" cy="14.1459" r="0.702804" fill="white" />
          </g>
          <defs>
            <clipPath id="clip0_1_71">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <p>ТОЛЬКО В ЭТОМ МЕСЯЦЕ СКИДКИ 20% НА ВСЕ УСЛУГИ</p>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1_71)">
            <path d="M15.9439 6.85256C14.1524 5.75248 13.9318 4.52356 13.9318 2.89863C13.9318 2.12924 14.1097 1.40147 14.4262 0.753858C14.1955 0.720451 13.9596 0.702881 13.7197 0.702881C11.0186 0.702881 8.82899 2.89249 8.82899 5.59355V10.7537C8.82899 11.528 8.20129 12.1557 7.42694 12.1557C6.65264 12.1557 6.0249 11.528 6.0249 10.7537V8.28702C4.35035 9.8718 3.30542 12.1152 3.30542 14.6028C3.30542 19.4046 7.19806 23.2973 11.9999 23.2973C16.8017 23.2973 20.6944 19.4046 20.6944 14.6028C20.6944 11.2209 18.7635 8.28998 15.944 6.85232" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.2501 12.8694L8.74951 19.3699" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="14.0016" cy="18.1215" r="0.702804" fill="white" />
            <circle cx="10.026" cy="14.1459" r="0.702804" fill="white" />
          </g>
          <defs>
            <clipPath id="clip0_1_71">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
        <Footer/>
    </>
  )
}


