import { LogoBanner } from "../../components/LogoBanner/LogoBanner";
import { Banner } from "./Banner/Banner";
import { Blog } from "./Blog/Blog";
import { Info } from "./InfoBlock/Info";
import { Masters } from "./Masters/Masters";
import { Partners } from "./Partners/Partners";
import { SaleBanner } from "./SaleBanner/SaleBanner";
import { Spa } from "./Spa/Spa";

export function AboutUs(){
    return(
        <>
        <LogoBanner image="/src/assets/imgs/aboutuslogo.png" title="О Нас"/>
        <Info/>
        <Spa/>
        <Banner/>
        <Partners/>
        <Masters/>
        <SaleBanner/>
        <Blog/>
        </>
    )
}