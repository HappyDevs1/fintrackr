"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from 'next/navigation'

export default function ForecastPlot() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/forecast");

        if (response.data?.plot) {
          setImageSrc(response.data.plot);
        } else {
          throw new Error("No plot data received");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load forecast");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading forecast...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="px-10" id="forecast">
      <div className="lg:px-15 lg:py-10">
        <div>
          <p className="font-semibold text-2xl md:text-3xl lg:text-4xl">FINTRACKR</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 ">
          <div className="flex justify-around gap-1 mb-5 lg:flex-col lg:justify-start lg:items-start lg:gap-4 text lg:text-2xl md:text-xl">
            <button className="bg-gray-200 lg:w-42 lg:py-1 rounded-bl-lg" onClick={() => redirect("#forecast")}>Forecast</button>
            <button className="bg-gray-200 lg:w-42  lg:py-1 rounded-bl-lg">Balances</button>
            <button className="bg-gray-200 lg:w-42  lg:py-1 rounded-bl-lg">Transactions</button>
            <button className="bg-gray-200 lg:w-42  lg:py-1 rounded-bl-lg">Beneficiaries</button>
          </div>
          <div className="flex flex-col items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Balance Forecast"
                className="w-full max-w-3xl mx-auto"
                width={800}
                height={400}
              />
            ) : (
              <div>No forecast data available</div>
            )}
            <p className="mt-5">You will be left with x amount by x amount of time</p>
          </div>
        </div>
        {/* Transactions container */}
        <div>
        <p className="lg:w-42 lg:py-1 rounded-bl-lg mt-15 font-semibold text-lg md:text-2xl lg:text-2xl">Transactions</p>
        </div>
      </div>
    </div>
  );
}
