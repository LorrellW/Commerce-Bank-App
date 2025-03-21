"use client";

import { UsergroupAddOutlined, BankTwoTone } from "@ant-design/icons";
import Image from "next/image";
import StreetPic from "@/app/Icons/streetBirdsView.jpg";

const ThreeCard = () => {
  return (
    <section className="relative min-h-max">
      {/* Background image */}
      <Image
        src={StreetPic}
        alt="Background"
        objectFit="cover"
        className="absolute inset-0 z-0"
        priority
      />
      {/* Content container for cards */}
      <div className="relative z-10 p-12 flex flex-col lg:grid lg:grid-cols-3 justify-items-center items-center">
        <div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 p-4 py-6 text-center justify-items-center rounded-lg border-blue-300 border-4">
          <UsergroupAddOutlined className="text-blue-500 text-4xl" />
          <div className="text-darkText text-2xl">Membership Organizations</div>
          <div className="text-lightText">
            Our membership management software provides full automation of membership renewals and payments
          </div>
        </div>
        <div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 p-4 py-6 text-center justify-items-center rounded-lg border-blue-300 border-4">
          <BankTwoTone className="text-4xl text-darkText" />
          <div className="text-darkText text-2xl">National Associations</div>
          <div className="text-lightText">
            Our membership management software provides full automation of membership renewals and payments
          </div>
        </div>
        <div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 p-4 py-6 text-center justify-items-center rounded-lg border-blue-300 border-4">
          <BankTwoTone className="text-4xl text-darkText" />
          <div className="text-darkText text-2xl">Clubs And Groups</div>
          <div className="text-lightText">
            Our membership management software provides full automation of membership renewals and payments
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeCard;
