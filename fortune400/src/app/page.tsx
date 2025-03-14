"use client";

import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ArrowRightOutlined, BankOutlined } from "@ant-design/icons";
import ThreeCard from "./components/threeCard";
import G2 from "@/app/Icons/pana.png";
import G3 from "@/app/Icons/rafiki.png";
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
import bgPic3 from "@/app/Icons/building-pic.jpg"

export default function Home() {
  return (
    <>
      <div>
      <section className="relative min-w-screen ">
  {/* Full background image */}
  <Image
    src={bgPic3}
    alt="Background"
    layout="fill"
    objectFit="cover"
    className="absolute inset-0 z-0"
    priority
  />

  {/* Content overlay */}
  <div className="relative grid lg:grid-cols-2 justify-items-center min-h-[600px]">
    <div className=" flex flex-col">
      <p className="mt-28 lg:text-6xl text-5xl text-slate-50">Modern Banking</p>
      <p className="lg:text-6xl text-5xl text-cyan-300">Built for <span className="text-orange-300">you.</span></p>
      <p className="lg:text-md mt-8 text-sky-100">
        Where to monitor all your financial needs.
      </p>
      <button className="bg-primary mt-4 text-sm rounded w-[30%] max-h-10 h-[30%]">
        Register
      </button>
    </div>
  </div>
</section>
      </div>
      <section className="min-h-[600px] bg-white">
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

        <ThreeCard></ThreeCard>

        <section>
          <div className="grid lg:grid-cols-2 items-center sm:gap-y-0 justify-items-center min-h-[600px] bg-secondary">
            <div className="hidden sm:block">
              <Image
                src={G3}
                alt="graphic 3"
                width={500}
                height={500}
                priority
              />
            </div>
            <div className="min-w-sm max-w-xl grid grid-rows-3 justify-items-center rounded-lg">
              <p className="lg:text-5xl text-4xl text-darkText">The unseen of spending <br />three years at Pixelgrade</p>
              <p className="lg:text-md text-lg text-lightText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla.
                Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae,
                tempus sem. Donec elementum pulvinar odio.</p>
              <button className="bg-primary mt-6 py-2 text-sm rounded w-[30%] h-[30%]">
                Learn More
              </button>
            </div>

          </div>
        </section>

        <section className="flex flex-col lg:grid lg:grid-cols-2 place-items-center bg-secondary2">

          <div className="items-center grid grid-rows-3 py-6 ">
            <p className="lg:text-5xl text-4xl text-gray-600">Easy Banking</p>
            <p className="lg:text-5xl text-4xl text-primary">Done Right.</p>
            <p className="lg:text-md text-gray-600">We reached here with our hard work and dedication.</p>
          </div>

          <div className="grid grid-cols-2 gap-10 p-8 ">
            <div className=" grid grid-cols-2 py-4 place-items-center rounded-lg">
              <div><BankOutlined className="flex text-4xl text-darkText" /></div>
              <div className="flex-row">
                <p className="text-darkText">2,245,341</p>
                <p className="text-darkText">Memebers</p>

              </div>
            </div>
            <div className="grid grid-cols-2 py-4 place-items-center rounded-lg">
              <div><BankOutlined className="flex text-4xl text-darkText" /></div>
              <div className="flex-row">
                <p className="text-darkText">2,245,341</p>
                <p className="text-darkText text-xl">Clubs</p>
              </div>
            </div>
            <div className=" grid grid-cols-2 py-4 place-items-center rounded-lg">
              <div><BankOutlined className="flex text-4xl text-darkText" /></div>
              <div className="flex-row">
                <p className="text-darkText">2,245,341</p>
                <p className=" text-darkText text-xl">Events</p>
              </div>
            </div>
            <div className=" grid grid-cols-2 py-4 place-items-center rounded-lg">
              <div><BankOutlined className="flex text-4xl text-darkText" /></div>
              <div className="flex-row">
                <p className="text-darkText">2,245,341</p>
                <p className="text-darkText text-xl">Payments</p>
              </div>
            </div>

          </div>

        </section>

        <section>
          <div className="grid lg:grid-cols-2 items-center justify-items-center min-h-[600px] bg-secondary">
            <div className="hidden sm:block">
              <Image
                className="cartoon-graphic-1"
                src={G2}
                alt="Fortune400 Logo"
                width={500}
                height={500}
                priority
              />
            </div>
            <div className="min-w-sm max-w-xl grid grid-rows-3 justify-items-center rounded-lg">
              <p className="lg:text-5xl text-4xl text-darkText">See what we can do for you this tax season</p>
              <p className="lg:text-md text-lg text-lightText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla.
                Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae,
                tempus sem. Donec elementum pulvinar odio.</p>
              <button className="bg-primary mt-6 py-2 text-sm rounded w-[30%] h-[30%]">
                Learn More
              </button>
            </div>

          </div>
        </section>
        <p className="mt-6 text-darkText text-center font-bold text-3xl">
          Banking with A.i
        </p>
        <p className="mt-6 text-lightText text-center">
          The Nexcent blog is the best place to read about the latest membership insights, trends and more. See whos joining the community, read about how our community are increasing their membership income and a lot more.
        </p>

        <section className=" flex flex-col p-10 lg:grid lg:grid-cols-3 justify-items-center items-center">

          <div className="min-w-sm max-w-xs bg-secondary2 grid grid-rows-3 py-4 text-center justify-items-center rounded-lg">
            <div className="text-darkText text-2xl">Membership Organizations</div>
            <div className="text-lightText">
              Creating Streamlined Safeguarding Processes with OneRen
            </div>
            <p className="pt-6 text-primary">Read More <ArrowRightOutlined /> </p>
          </div>

          <div className="min-w-sm max-w-xs bg-secondary2 grid grid-rows-3 py-4 text-center justify-items-center rounded-lg">
            <div className="text-darkText text-2xl">National Associations</div>
            <div className="text-lightText">
              What are your safeguarding responsibilities and how can you manage them?
            </div>
            <p className="pt-6 text-primary">Read More <ArrowRightOutlined /> </p>
          </div>

          <div className="min-w-sm max-w-xs bg-secondary2 grid grid-rows-3 py-4 text-center justify-items-center rounded-lg">
            <div className="text-2xl text-darkText">Clubs And Groups</div>
            <div className="text-lightText">
              Revamping the Membership Model with Triathlon Australia
            </div>
            <p className="pt-6 text-primary">Read More <ArrowRightOutlined /> </p>
          </div>
        </section>

      </section>
    </>
  );
}
