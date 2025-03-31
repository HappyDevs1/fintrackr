"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import SpendingPieChart from "./components/SpendingPieChart";
import SpendingRecommendations from "./components/SpendingRecommendations";

interface SpendingData {
  place: string;
  totalAmount: number;
}

export default function ForecastPlot() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
  const topCategory = spendingData[0]?.place || '';
  const topAmount = spendingData[0]?.totalAmount || 0;
  const totalSpending = spendingData.reduce((sum, item) => sum + item.totalAmount, 0);
  const topPercentage = totalSpending > 0 ? Math.round((topAmount / totalSpending) * 100) : 0;

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
      <h1 className="text-2xl font-bold mb-6">Your Spending Breakdown</h1>
      
      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="h-96">
          <SpendingPieChart data={spendingData} />
        </div>
      </div>

      {/* Recommendations */}
      {spendingData.length > 0 && (
        <SpendingRecommendations 
          topCategory={topCategory} 
          topAmount={topAmount} 
          percentage={topPercentage} 
        />
      )}

      {/* Spending Details */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Detailed Breakdown</h2>
        <div className="space-y-2">
          {spendingData.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ 
                    backgroundColor: [
                      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                    ][index % 5] 
                  }}
                />
                <span>{item.place}</span>
              </div>
              <span className="font-medium">R{item.totalAmount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}
