// RegisterComponent.tsx
"use client"
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import { useRouter } from 'next/navigation';


export default function settingsPage() {
  const { user,setUser } = useUser();  
  const router = useRouter(); // ✅ define router here
  const [, setMounted] = useState(false);


  /* ─────────────────── local form state ─────────────────── */
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [, setMessage] = useState("");


  /* ----- pre‑fill from Context on first mount ----- */
  useEffect(() => {
    const refresh = () => router.refresh();
    refresh();
    setMounted(true)
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  
    /* ─────────────────── submit handler ─────────────────── */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.uid) {
      setMessage("Must be logged in via Firebase first.");
      return;
    }
    const userData = {
      firstName,
      lastName ,
      email,
      street: streetAddress,
      city,
      state: region,
      zip: zipCode,
      country,
      firebase_uid: user.uid,
    };

    console.log("Collected user data:", userData);

    try {

      const response = await axios.post("/api/register", userData, {
        headers: { "Content-Type": "application/json" },
        
      });
      console.log("response",response.data); // contains CID inside customer
      const result = response.data;
      

  
      if (result.success && result.data) {
        setMessage("Registration details saved successfully!");
  
        // ✅ Update context with new cID
        setUser({
          ...user!,
          cID: result.data?.customer?.cID,
          firstName,
          lastName,
        });
        console.log(result.data?.data?.customer?.cID,"result.data?.data?.customer?.cID,");
  
      } else {
        setMessage("Registration completed, but no user ID was returned.");
      }
  
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`Error saving registration details: ${err.message}`);
        console.error("Error saving registration details:", err.message);
      } else {
        setMessage("An unexpected error occurred.");
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  return (
    <div className="w-full pt-8 pb-6">
      <form onSubmit={handleSubmit} className="place-items-center">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* First Name */}
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                  First name
                </label>
                <div className="mt-2">
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block border border-solid w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block border border-solid w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block border border-solid w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="col-span-full">
                <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                  Street address
                </label>
                <div className="mt-2">
                  <input
                    id="street-address"
                    name="street-address"
                    type="text"
                    autoComplete="street-address"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="block border border-solid w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* City */}
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block border border-solid w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Region / State */}
              <div className="sm:col-span-2">
                <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    id="region"
                    name="region"
                    type="text"
                    autoComplete="address-level1"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="block border border-solid w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* ZIP / Postal Code */}
              <div className="sm:col-span-2">
                <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                  ZIP / Postal code
                </label>
                <div className="mt-2">
                  <input
                    id="postal-code"
                    name="postal-code"
                    type="text"
                    autoComplete="postal-code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="block border border-solid w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="sm:col-span-3">
                <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                  Country
                </label>
                <div className="mt-2">
                  <select
                    id="country"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="block border border-solid w-full rounded-md bg-white py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                  >
                    <option value="">Select a country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold text-gray-900">
            Cancel
          </button>

          <button
          onClick={() => router.push('/pages/profile')} // 👈 redirects to profile page
          type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Save
          </button>
          <div>
      </div>
        </div>
      </form>
    </div>
  );
};
