"use client";

import { UsergroupAddOutlined, BankTwoTone } from "@ant-design/icons";
// import Image from "next/image";
// import StreetPic from "@/app/Icons/streetBirdsView.jpg";

const ThreeCard = () => {
  return (
    <section className="relative max-h-[600px]">
      {/* Background image */}
      {/* <Image
        src={StreetPic}
        alt="Background"
        className="absolute inset-0 z-0 object-contain"
        priority
      /> */}
      {/* Content container for cards */}
      <div className="relative z-10 p-12 flex flex-col lg:grid lg:grid-cols-3 justify-items-center items-center">
        <div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 p-4 py-6 text-center justify-items-center rounded-lg border-blue-300 border-4">
          <UsergroupAddOutlined className="text-blue-500 text-4xl" />
          <div className="text-darkText text-2xl">Membership</div>
          <div className="text-lightText">
            Our software provides full automation of payment monitorization for members
          </div>
        </div>
        <div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 p-4 py-6 text-center justify-items-center rounded-lg border-blue-300 border-4">
          <BankTwoTone className="text-4xl text-darkText" />
          <div className="text-darkText text-2xl">Our Institution</div>
          <div className="text-lightText">
            See our team, along with where to get answers to your questions
          </div>
        </div>
        <div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 p-4 py-6 text-center justify-items-center rounded-lg border-blue-300 border-4">
          <BankTwoTone className="text-4xl text-darkText" />
          <div className="text-darkText text-2xl">Our Policies</div>
          <div className="text-lightText">
            Here is our commitment to your prosperity and protection
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeCard;
