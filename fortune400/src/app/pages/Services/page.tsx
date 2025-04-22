import ThreeCard from "@/app/components/threeCard";
import Link from "next/link";

export default function ServicesPage() {
    return (
        <div>
          <ThreeCard />
          <ThreeCard />

          <div className="grid grid-cols-3">
            <Link
              className="grid col-start-2 place-items-center justify-self-center bg-blue-600  w-36 h-20" 
              href={'./Taxes'}>Taxes Page
            </Link>

          </div>
        </div>
    );
}
