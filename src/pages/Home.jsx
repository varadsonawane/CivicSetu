import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import LiveMap from "../components/LiveMap/LiveMap";
import HowItWorks from "../components/HowItWorks/HowItWorks";

import { useEffect, useState } from "react";


const Home = () => {
  
const [reports, setReports] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/reports")
    .then((response) => response.json())
    .then((data) => setReports(data));
}, []);

  return (
    <>
    <Navbar />
    <Hero />
    <LiveMap  reports={reports}/>
    <HowItWorks />
    </>
  )
}

export default Home