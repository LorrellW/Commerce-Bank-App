// app/Taxes/page.tsx
"use client";

import axios from "axios";
import { useState, useEffect } from "react";


export default function TaxesPage() {
 
  const[isOpen, setIsOpen] = useState(false);
  const[data, setData] = useState({});
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(null);
  

  useEffect(()=>{
    const fetchData = async () => {
      try{
        const response = await axios.get('https://dummyjson.com/test');
        setData(response.data);
        console.log(data);
        setLoading(false);
      }
      catch(err){
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  },[]);
  
  const toScreen = () => 
    setData(data);
    {JSON.stringify(data)};

if(loading){
  return(
    <div>Loading...</div>
  )
}
else{
    return (
      
      <div className="w-screen h-auto bg-black place-items-center">
        <div>api data here.{JSON.stringify(data)}</div>  
        <h1 className="p-6">api test page</h1>
        <p className="p-6">WTesting API's...</p>

        <button
        onClick={() =>setIsOpen(true)}
        className="bg-green-600 text-black w-36 h-20 place-content-center">
          modal Button
        </button>
        
        { isOpen ? (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
    <div className="relative bg-white w-96 h-72 rounded-lg">
      <button
        className="absolute top-0 right-0 m-1 bg-primary text-white w-16 h-8 rounded-lg"
        onClick={() => setIsOpen(false)}
      >
        X
      </button>
      <div className="flex items-center justify-center text-black text-xl h-full">
        Modal Content...
      </div>
      <button
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-lg w-20 h-12"
        onClick={() => setIsOpen(false)}
      >
        CLOSE
      </button>
    </div>
  </div>
) : null 
        }
      </div>
    );
  }
}