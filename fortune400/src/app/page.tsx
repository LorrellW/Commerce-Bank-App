// (root) page.tsx
import G1 from "./graphic1.png";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex flex-grid-cols-2 items-center justify-evenly h-96 bg-secondary2">
        <div className="flex-row justify-center">
          <p className="text-5xl text-gray-600">Modern Banking</p>
        <p className="text-5xl text-primary">Built for you.</p>
        <p className="text-sm py-4 text-gray-600">Where to monitor all you financial needs.</p>
        <button className="bg-primary px-6 mt-6 py-2 text-sm rounded-md">Register</button>

        </div>
        <div>
        <Image
          className="logo-style"
          src={G1}
          alt="Fortune400 Logo"
          width={350}
          height={80}
          priority
        />
                
        </div>
        
    </div>
    <div className="flex flex-grid-cols-2 items-center text-2xl text-primary justify-evenly h-96 bg-white">Our Tech
            </div>
          
</div>
  );
}
