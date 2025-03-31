"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import SpendingPieChart from "./components/SpendingPieChart";

interface SpendingData {
  place: string;
  totalAmount: number;
}

export default function ForecastPlot() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);

  const fetchTopTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/top/transactions"
      );

      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load transactions");
    }
  };

  const fetchTopSpendingData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/top/transactions"
      );
      if (response.data?.topLocations) {
        setSpendingData(response.data.topLocations);
      }
    } catch (err) {
      setError("Failed to load spending data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    fetchTopTransactions();
    fetchTopSpendingData();
  }, []);

  if (loading) return <div>Loading forecast...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="px-10" id="forecast">
      <div className="lg:px-15 lg:py-10">
        <div>
          <p className="font-semibold text-2xl md:text-3xl lg:text-4xl">
            FINTRACKR
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 ">
          <div className="flex justify-around gap-1 mb-5 lg:flex-col lg:justify-start lg:items-start lg:gap-4 text lg:text-2xl md:text-xl">
            <button
              className="bg-gray-200 lg:w-42 lg:py-1 rounded-bl-lg"
              onClick={() => redirect("#forecast")}
            >
              Forecast
            </button>
            <button className="bg-gray-200 lg:w-42  lg:py-1 rounded-bl-lg">
              Balances
            </button>
            <button className="bg-gray-200 lg:w-42  lg:py-1 rounded-bl-lg">
              Transactions
            </button>
            <button className="bg-gray-200 lg:w-42  lg:py-1 rounded-bl-lg">
              Beneficiaries
            </button>
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
            <p className="mt-5">
              You will be left with x amount by x amount of time
            </p>
          </div>
        </div>
        {/* Transactions container */}
        <div className="mt-20">
          <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Top Spending Categories</h1>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="relative h-[300px] w-full sm:h-[400px] md:h-[500px]">
                <SpendingPieChart data={spendingData} />
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Breakdown</h2>
                <ul className="mt-2 space-y-1">
                  {spendingData.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.place}</span>
                      <span>R{item.totalAmount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
