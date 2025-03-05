"use client";
import bgPic from "@/app/Icons/winter-pic.webp";
import bgPic2 from"@/app/Icons/trees-road.jpg";
import { UsergroupAddOutlined, BankTwoTone } from "@ant-design/icons";
import Image from "next/image";

const ThreeCard = ()=>{
    return(
        <>  
    <section className="flex flex-col p-10 lg:grid lg:grid-cols-3 justify-items-center items-center bg-secondary2">

<div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 py-4 text-center justify-items-center rounded-lg">
  <UsergroupAddOutlined className="text-blue-500 text-4xl" />
  <div className="text-darkText text-2xl">Membership Organizations</div>
  <div className="text-lightText">
    Our membership management software provides full automation of membership renewals and payments
  </div>
</div>

<div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 py-4 text-center justify-items-center rounded-lg">
  <BankTwoTone className="text-4xl text-darkText" />
  <div className="text-darkText text-2xl">National Associations</div>
  <div className="text-lightText">
    Our membership management software provides full automation of membership renewals and payments
  </div>
</div>

<div className="shadow-md min-w-sm max-w-xs bg-white grid grid-rows-3 py-4 text-center justify-items-center rounded-lg">
  <BankTwoTone className="text-4xl" />
  <div className="text-2xl text-darkText">Clubs And Groups</div>
  <div className="text-lightText">
    Our membership management software provides full automation of membership renewals and payments
  </div>
</div>
</section>
</>
    );
}
export default ThreeCard;
