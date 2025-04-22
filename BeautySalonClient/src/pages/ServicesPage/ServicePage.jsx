import { LogoBanner } from "../../components/LogoBanner/LogoBanner";
import { Masters } from "../AboutUs/Masters/Masters";
import { Catalog } from "./Catalog/Catalog";
import { Services } from "./Services/Services";

export function ServicePage(){
    return (
        <>
            <LogoBanner image="/src/assets/imgs/serviceslogo.png" title="Услуги"/>
            <Services/>
            <Catalog/>

        </>
    )
}