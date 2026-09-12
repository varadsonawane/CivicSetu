import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import LiveMap from "../components/LiveMap/LiveMap";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import ChatBox from "../components/ChatBox/ChatBox";
import GradientWaves from "../components/GradientWaves/GradientWaves";
import { useAuth } from "../context/AuthContext";
import Dashboard from "./Dashboard";
import { useEffect, useState } from "react";

const Home = () => {
  const { user, loading } = useAuth();

  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((response) => response.json())
      .then((data) => {
        setReports(data);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  }, []);

  return (
    <div className="relative min-h-screen">

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          mouseInteraction
          parallaxStrength={0.5}
          grain
          grainIntensity={0.05}
        />
      </div>

      {/* Website Content */}
      <div className="relative z-10">

        <Navbar />

        <Hero />

        <LiveMap reports={reports} />

        <HowItWorks />

        {/* Show Dashboard only when user is logged in */}
        {user && !loading && <Dashboard />}

        <ChatBox />

      </div>

    </div>
  );
};

export default Home;