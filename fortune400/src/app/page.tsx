// (root) page.tsx

import Image from "next/image";
import G1 from "@/app/Icons/graphic1.png";
import Antsvg from "@/app/Icons/antD.svg"
import figma from "@/app/Icons/figma.svg"
import java from "@/app/Icons/java.svg"
import javaScript from "@/app/Icons/javaScript.svg"
import jenkins from "@/app/Icons/jenkins.svg"
import nextJS from "@/app/Icons/nextJS.svg"
import npm from "@/app/Icons/npm.svg"
import react from "@/app/Icons/react.svg"
import tailWind from "@/app/Icons/tailWind.svg"
import ts from "@/app/Icons/ts.svg"



export default function Home() {
  return (
    <div>

      <section>
        <div className="flex flex-grid-cols-2 items-center justify-evenly h-[600] bg-secondary2">
          <div className="flex-row justify-center">
            <p className="text-5xl text-gray-600">Modern Banking</p>
            <p className="text-5xl text-primary">Built for you.</p>
            <p className="text-sm py-4 text-gray-600">Where to monitor all you financial needs.</p>
            <button className="bg-primary px-6 mt-6 py-2 text-sm rounded-md">Register</button>
          </div>
          <div>
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

      <section className="h-[600] bg-white">
        <div className="flex-row space-y-8 py-6">
          <p className="text-darkText text-center font-bold text-3xl"> Our Tech </p>
          <p className="text-lightText text-center ">Reliable Banking backed by a roubust, and community supported tech stack</p>
        </div>

      <section className="flex">
        <div className="flex">

          <Image 
              src={nextJS} 
              alt="Next.JS Logo"></Image>

          <Image 
              src={npm} 
              alt="Npm Logo"></Image>

          <Image 
              src={react} 
              alt="React Logo"></Image>

          <Image 
              src={ts} 
              alt="TypeScript Logo"></Image>
          <Image 
              src={Antsvg} 
              alt="AntDesign Logo"></Image>

          <Image 
              src={tailWind} 
              alt="tailWind Logo"></Image>

          <Image 
              src={figma} 
              alt="Figma Logo"
              width={100}></Image>

          <Image 
              src={java} 
              alt="AntDesign Logo"></Image>

          <Image 
              src={javaScript} 
              alt="javaScript Logo"></Image>

          <Image 
              src={jenkins} 
              alt="jenkins Logo"></Image>



        </div>
      </section>
      </section>
    </div>
  );
}
