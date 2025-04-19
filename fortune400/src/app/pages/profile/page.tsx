"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";

interface Customer {
  cID: number;
  email: string;
  phoneNumber: string | null;
  firebase_uid: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function CustomerProfile() {
  const { user } = useUser();
  const [cust, setCust] = useState<Customer | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.cID) return;                        // wait until cID is ready

    axios
      .get("/api/customer", {
        headers: { "x-user-cid": user.cID },
      })
      .then((res) => setCust(res.data.customer))
      .catch((err) => {
        console.error(err);
        setError("Could not load customer profile");
      });
  }, [user?.cID]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!cust)   return <p className="text-red-600 text-2xl text-center">Loading profile…</p>;

  /* simple table of every column */
  return (
    <div className="text-black w-screen h-[600px] bg-blue-800">
    <table className=" text-left">
      <tbody>
        {Object.entries(cust).map(([key, val]) => (
          <tr key={key}>
            <th className="pr-4 py-1 font-semibold">{key}</th>
            <td className="py-1">{val ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}