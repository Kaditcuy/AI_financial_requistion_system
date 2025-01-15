// landing page
import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
// sections
import Hero from "./hero";
import VideoIntro from "./video-intro";
import Feature from "./feature";
import MobileConvenience from "./mobile-convenience";
import Testimonials from "./testimonials";
import Faqs from "./faqs";

export default function Campaign() {
  return (
    <ThemeProvider>
      <Navbar />
      <Hero />
      <VideoIntro />
      <Feature />
      <MobileConvenience />
      <Testimonials />
      <Faqs />
      <Footer />
    </ThemeProvider>
  );
}
