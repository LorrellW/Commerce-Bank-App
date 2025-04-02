import BarChart from "@/app/Icons/BarChart.jpg";
import LineChart from "@/app/Icons/LineChart.jpg";
import LineChart2 from "@/app/Icons/LineChart2.jpg"
import pieChart from "@/app/Icons/PieChart.jpg";
import Image from "next/image";

//Dashboard Page
const StickyLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-grow overflow-y-auto bg-gray-800 p-4">
        <h1>Main Content</h1>
        <div className="grid grid-cols-3 w-[900px] h-52 py-6 gap-8 justify-self-center">
          <button className="bg-[url('/blackCC.jpg')] bg-cover rounded-xl shadow-lg hover:shadow-zinc-600 place-content-center text-center bg-black">Account 1</button>
          <button className="bg-[url('/blackCC.jpg')] bg-cover rounded-xl shadow-lg hover:shadow-zinc-600 place-content-center text-center bg-black">Account 2</button>
          <button className="bg-[url('/blackCC.jpg')] bg-cover rounded-xl shadow-lg hover:shadow-zinc-600 place-content-center text-center bg-black">Account 3</button>
        </div>

      <section className="grid grid-cols-2 justify-items-center gap-y-10 text-center w-full h-auto text">
      <div className="bg-slate-300  h-60 w-72 place-content-center">
      <Image className="object-fill"
      src={BarChart}
      alt="Bar chart">
      </Image>
    </div>

    <div className="bg-slate-300 h-56 w-72 place-content-center">
    <Image className="object-fill"
      src={LineChart}
      alt="line chart">
      </Image>
    </div>

    <div className="bg-slate-300 h-56 w-72 place-content-center">
    <Image className="object-cover"
      src={LineChart2}
      alt="line chart">
      </Image>
    </div>

    <div className="bg-slate-300 h-56 w-72 place-content-center">
    <Image className="object-cover"
      src={pieChart}
      alt="pie chart">
      </Image>
    </div>
  </section>

    </div>
      <div className="sticky h-auto top-0 bg-gray-800 text-white pt-2 p-6 pb-2 text-center">API -- Stock Data
        <div className="w-96 h-52 m-2 bg-gray-600">box 1...</div>
        <div className="w-96 h-52 m-2 bg-gray-600">box 2...</div>
        <div className="w-96 h-52 m-2 bg-gray-600">box 3...</div>
      </div>

    </div>

  );
}

export default StickyLayout;
