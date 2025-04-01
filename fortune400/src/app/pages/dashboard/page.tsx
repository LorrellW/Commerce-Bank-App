
//Dashboard Page
const StickyLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-grow overflow-y-auto bg-primary p-4">
        <h1>Main Content</h1>
        <p>add more content to Scroll down to see the sticky effect...</p>
        <div className="w-auto space-x-8 h-56 py-6 grid grid-cols-3 justify-around">
          <div className="place-content-center text-center bg-black">box1</div>
          <div className="place-content-center text-center bg-black">box2</div>
          <div className="place-content-center text-center bg-black">box3</div>
        </div>
      </div>

      <div className="sticky top-0 w-90 bg-gray-800 text-white p-4 pb-2 text-center">API -- Stock Data
        <div className="w-auto m-2 h-48 bg-gray-600">box 1...</div>
        <div className="w-auto m-2 h-48 bg-gray-600">box 2...</div>
        <div className="w-auto m-2 h-48 bg-gray-600">box 3...</div>

      </div>


    </div>
  );
}

export default StickyLayout;
