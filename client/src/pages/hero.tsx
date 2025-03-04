"use client";

import Link from 'next/link';
import { ThemeProvider } from "@material-tailwind/react";
import Image from "next/image";
import { Button, Typography } from "@material-tailwind/react";


function Hero() {
  return (
    <ThemeProvider>
    <div className="relative min-h-screen w-full">
      <header className="grid !min-h-[49rem] bg-gray-900 px-8">
        <div className="container mx-auto mt-32 grid h-full w-full grid-cols-1 place-items-center lg:mt-14 lg:grid-cols-2">
          <div className="col-span-1">
            <Typography variant="h1" color="white" className="mb-4">
              FIRA <br />
            </Typography>
            <Typography
              variant="lead"
              className="mb-7 !text-white md:pr-16 xl:pr-28"
            >
              Financial Intelligent Requisition Assistant
            </Typography>
            <Typography className="mb-4" color="white" variant="h6">
              Get Started with FIRA!
            </Typography>
            <div className="flex flex-col gap-2 md:mb-2 md:w-10/12 md:flex-row">
              <Link href="/auth/login" passHref>
              <Button
                size="lg"
                color="white"
                className="flex justify-center items-center gap-3"
              >
                Login
              </Button>
              </Link>

              <Link href="/auth/signup" passHref>
              <Button
                size="lg"
                color="white"
                className="flex justify-center items-center gap-3"
              >
                Sign Up
              </Button>
              </Link>
            </div>
          </div>
          <Image
            width={470}
            height={576}
            src="/image/iphones.png"
            alt="team work"
            className="col-span-1 my-20 h-full max-h-[30rem] -translate-y-32 md:max-h-[36rem] lg:my-0 lg:ml-auto lg:max-h-[40rem] lg:translate-y-0"
          />
        </div>
      </header>
      <div className="mx-8 lg:mx-16 -mt-24 rounded-xl bg-white p-5 md:p-14 shadow-md">
        <div>
          <Typography variant="h3" color="blue-gray" className="mb-3">
          Streamline Your Financial Requisitions with AI-Powered Precision
          </Typography>
          <Typography
            variant="paragraph"
            className="font-normal !text-gray-500 lg:w-5/12"
          >
           FIRA revolutionizes the way you manage financial requests, approvals, and procurement processes. Experience efficiency, accuracy, and transparency like never before.
           </Typography>
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
}
export default Hero;
