import { LogoBanner } from "../../components/LogoBanner/LogoBanner"
import { Instagram } from "../HomePage/Instagram/Instagram"
import { ContactInfo } from "./ContactInfo/ContactInfo"
import s from "./Contacts.module.css"

export function Contacts(){
    return(
        <>
        <LogoBanner title="Наши Контакты"/>
        <ContactInfo/>
        <Instagram/>
        </>
    )
}