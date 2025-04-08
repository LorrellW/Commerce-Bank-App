// app/Taxes/page.tsx
"use client";

import axios from "axios";
import { useState, useEffect } from "react";


export default function TaxesPage() {
 
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
      </div>
    );
  }
}