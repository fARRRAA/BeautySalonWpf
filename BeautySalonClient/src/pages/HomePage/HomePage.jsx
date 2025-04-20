import { LogoBanner } from "./LogoBanner/LogoBanner"
import h from "./HomePage.module.css"
import { Services } from "./ServicesHomePage/Services"
import { Treatments } from "./Treatments/Treatments"
import { Testimonials } from "./Testimonials/Testimonials"
import { Advantages } from "./Advantages/Advantages"
import { Shop } from "./Shop/Shop"
import { Instagram } from "./Instagram/Instagram"

export function HomePage(){
    return (
        <>
        <LogoBanner/>
        <Services/>
        <Treatments/>
        <Testimonials/>
        <Advantages/>
        <Shop/>
        <Instagram/>
        </>
    )
}