"use client";

import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { SmileOutlined, HeartOutlined, StarOutlined } from "@ant-design/icons";

import G1 from "@/app/Icons/graphic1.png";
import Antsvg from "@/app/Icons/antD.svg";
import figma from "@/app/Icons/figma.svg";
import java from "@/app/Icons/java.svg";
import javaScript from "@/app/Icons/javaScript.svg";
import jenkins from "@/app/Icons/jenkins.svg";
import nextJS from "@/app/Icons/nextJS.svg";
import npm from "@/app/Icons/npm.svg";
import react from "@/app/Icons/react.svg";
import tailWind from "@/app/Icons/tailWind.svg";
import ts from "@/app/Icons/ts.svg";
import { Carousel } from "react-responsive-carousel";

// Dynamically import Carousel with no SSR to avoid server-side issues

export default function Home() {
  return (
    <div className="pb-56">
      <section>
        <div className="grid lg:grid-cols-2 items-center justify-items-center h-[600px] bg-secondary2">
          <div className="flex-row">
            <p className="lg:text-5xl text-4xl text-gray-600">Modern Banking</p>
            <p className="lg:text-5xl text-4xl text-primary">Built for you.</p>
            <p className="lg:text-sm py-4 text-gray-600">
              Where to monitor all your financial needs.
            </p>
            <button className="bg-primary mt-6 py-2 text-sm rounded w-[30%]">
              Register
            </button>
          </div>
          <div className="hidden sm:block">
            <Image
              className="cartoon-graphic-1"
              src={G1}
              alt="Fortune400 Logo"
              width={400}
              height={400}
              priority
            />
          </div>
        </div>
      </section>

      <section className="h-[600px] bg-white">
        <div className="flex flex-col space-y-8 py-6">
          <p className="text-darkText text-center font-bold text-3xl">
            Our Tech
          </p>
          <p className="text-lightText text-center">
            Reliable Banking backed by a robust, and community supported tech stack
          </p>
        </div>

        <section className="place-items-center">
          <div className="grid grid-cols-5 lg:grid-cols-10 lg:justify-center gap-10">
            <Image src={nextJS} alt="Next.JS Logo" width={64} height={64} />
            <Image src={npm} alt="Npm Logo" width={64} height={64} />
            <Image src={react} alt="React Logo" width={64} height={64} />
            <Image src={ts} alt="TypeScript Logo" width={64} height={64} />
            <Image src={Antsvg} alt="AntDesign Logo" width={64} height={64} />
            <Image src={tailWind} alt="TailWind Logo" width={64} height={64} />
            <Image src={figma} alt="Figma Logo" width={64} height={64} />
            <Image src={java} alt="Java Logo" width={64} height={64} />
            <Image src={javaScript} alt="JavaScript Logo" width={64} height={64} />
            <Image src={jenkins} alt="Jenkins Logo" width={64} height={64} />
          </div>
        </section>

        <div className="flex flex-col space-y-8 py-10">
          <p className="text-darkText text-center font-bold text-3xl">
            Our in house services
          </p>
          <p className="text-lightText text-center">
            See what Fortune400 can do for you!
          </p>
        </div>
        {/* Minimal Carousel Section using Ant Design Icons */}
        <section className="bg-gray-300 w-[42%] mx-auto h-auto">
          <div className="w-full">
            <Carousel showThumbs={false} autoPlay infiniteLoop>
              <div className="flex justify-center items-center h-64">
                <SmileOutlined style={{ fontSize: "64px" }} />
              </div>
              <div className="flex justify-center items-center h-64">
                <HeartOutlined style={{ fontSize: "64px" }} />
              </div>
              <div className="flex justify-center items-center h-64">
                <StarOutlined style={{ fontSize: "64px" }} />
              </div>
            </Carousel>
          </div>
        </section>
        {/* <div className="flex grid-cols-3 gap-2 justify-evenly">
          <div className="w-[12%] bg-slate-600 h-[111px] flex items-center justify-center">
            1
          </div>
          <div className="w-[12%] bg-slate-600 flex items-center justify-center">
            2
          </div>
          <div className="w-[12%] bg-slate-600 flex items-center justify-center">
            3
          </div>
        </div> */}
      </section>


    </div>
  );
}
